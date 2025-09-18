package com.example.tasks;                    // 声明当前文件属于哪个包（命名空间）

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication                        // 开启 Spring Boot 自动配置与组件扫描
public class TasksApplication {               // 定义一个公开的类，类名与文件名一致
    public static void main(String[] args) {  // Java 程序入口方法，固定写法
        SpringApplication.run(                // 启动 Spring 应用（内嵌 Tomcat 也随之启动）
                TasksApplication.class,       // 告诉 Spring 以这个类为启动位置（扫描同包及子包）
                args                          // 命令行参数（一般不用管）
        );
    }
}
