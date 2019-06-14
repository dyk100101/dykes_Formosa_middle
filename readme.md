## 后端的设计

​		这一层的主要功能是为前端服务器和内部处理器（内网穿透层）之间，提供数据交换和过滤，为处理器提供最基本的保护。

​		代码路径：<https://github.com/dyk100101/dykes_Formosa_middle>

### 基本结构和代码

​		这个服务器采用了Node.js + Express 的代码框架。

​		因为不需要进行前端设计，所以只是一个单纯的脚本集合，除了起始页和错误页之外没有页面设计。

![基本结构](/middle.png)

1. 接入端口：

   * /work_text    工作端口，以文本形式输入
   * /work_file     工作端口，以文件形式输入
   * /login            登录端口，简单的身份验证
   * /                   欢迎页，与工作无关，用于测试服务器

2. 其它访问控制：

   * filter             过滤器，用于用户登录状态的检查，记录所有访问痕迹

     *（注：因为用户登录功能不是重要功能，我们注释掉了这个检查，但是随时可以加回来）*

   * error            在端口全部失配（404），或者出现其它Http错误时，返回错误页和错误信息。

3. 用户状态：

   用Mongodb管理用户信息，并提供检查。由于不是重要功能，我们没有在这里进行完整的开发，但是实现了用户登录、登录检查这些基本安全功能。

   目前数据库中只有唯一一个用户\{dyk, 120410939\}。



### 前端交互协议

​	这是一个应用层的简单协议，约定了传入、传出的数据的格式和大小限制。

​	除了文件输入之外，都是基于Content-Type : application/json 和 application/x-www-form-urlencoded格式的。

1. work_text

	```json
   //输入, post, application/json
   body {
   	'text' -> str,	
   	'model' ->  {'Chinese-General', 'Chinese-Economics' }
   }
   //输出
   body {
		'ents'  -> [
	       'start'		->	int,
	       'end'		->	int,
    	   'label'		->	str
	  	],
	   	['errmsg' -> str, (仅在出错时具有此段)]
	}
	```
	


2. work_file

   ```json
   //输入, post, application/formdata
   body {
   	'model' ->  {'Chinese-General', 'Chinese-Economics' }
   }
   file -> str 中文长度不超过200。
   //输出
   body {
   	'ents'  -> [
       	'start'		->	int,
          	'end'		->	int,
          	'label'		->	str
      	],
      	['errmsg' -> str, (仅在出错时具有此段)]
   }
   ```

   

3. login

   ```json
   //输入，post
   query string{
   	'username' -> str,
   	'password' -> str
   }
   //输出，记录登录状态，重定向到欢迎页以供测试
   cookie {
   	...
   	session_id -> str，回传session id
   }
   ```

   

4. 错误处理

   这个项目的错误分为两类，有不同的处理方法：

   * http错误

	```json
	设置response.status
	重定向到error页，并显示错误信息。
	```

	* 非http错误，诸如格式错误，数据库访问错误等等，在关键部位catch，根据错误来源提供的代码来反馈错误。
	
	```json
	Content-Type : application/json
	body {
		...
		errmsg -> str
	}
	```



### 处理器交互协议

​		这个相对比较简单，不同的处理方法(model)提供了不同的接口，我们只需要把待处理文本传过去即可，交互格式如下

```json
//请求 post, Content-Type : application/x-www-form-urlencoded
{
	'text' -> str
}

//返回 , Content-Type : application/x-www-form-urlencoded
{
	'ents' -> [
		'start'	-> int,
		'end'	-> int,
		'label'	-> str
	]
}
```





### 其它细节

1. 文件上传

   在使用文件进行标注请求时，formData中的文件是以upload形式上传的，这里我使用了express里提供的formData专用中间件formidable，来进行文件的提取和过滤。同时把上传的文件保存为临时文件，交给express自行删除。

2. 配置文件/routes/config.js

   保存了输入的model的枚举类型与处理器的接口url的映射

   保存了与处理器的HTTP头部。

   ​	