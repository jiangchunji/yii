<?php

// uncomment the following to define a path alias
// Yii::setPathOfAlias('local','path/to/local-folder');

// This is the main Web application configuration. Any writable
// CWebApplication properties can be configured here.
return array(
    'basePath'          => dirname(__FILE__) . DIRECTORY_SEPARATOR . '..',
    'name'              => 'My Web Application',

    // preloading 'log' component
    'preload'           => array('log'),

    // autoloading model and component classes
    'import'            => array(
        'application.models.*',
        'application.components.*',
    ),

    'modules'           => array(
        // uncomment the following to enable the Gii tool
        /*
        'gii'=>array(
            'class'=>'system.gii.GiiModule',
            'password'=>'Enter Your Password Here',
            // If removed, Gii defaults to localhost only. Edit carefully to taste.
            'ipFilters'=>array('127.0.0.1','::1'),
        ),
        */
        // uncomment the following to enable the Gii tool
        'gii' => array(
            'class'     => 'system.gii.GiiModule',
            'password'  => '123456',
            // If removed, Gii defaults to localhost only. Edit carefully to taste.
            'ipFilters' => array('127.0.0.1', '::1'),
        ),
        'sys'

    ),

    // application components
    'components'        => array(

        'user'         => array(
            // enable cookie-based authentication
            'allowAutoLogin' => true,
        ),

        // uncomment the following to enable URLs in path-format
        /*
        'urlManager'=>array(
            'urlFormat'=>'path',
            'rules'=>array(
                '<controller:\w+>/<id:\d+>'=>'<controller>/view',
                '<controller:\w+>/<action:\w+>/<id:\d+>'=>'<controller>/<action>',
                '<controller:\w+>/<action:\w+>'=>'<controller>/<action>',
            ),
        ),
        */

        // database settings are configured in database.php
//		'db'=>require(dirname(__FILE__).'/database.php'),
        'db'           => array(
            'connectionString' => 'mysql:host=localhost;dbname=yii', //test为数据库名
            'emulatePrepare'   => true,
            'username'         => 'root', //这里是数据库用户名
            'password'         => '', //这里是你的数据库密码
            'charset'          => 'utf8',
//            'tablePrefix'      => 'tbl_'
        ),
        'errorHandler' => array(
            // use 'site/error' action to display errors
            'errorAction' => 'site/error',
        ),

        //系统日志 by jcj 2015-8-20
        'log'          => array(
            'class'  => 'CLogRouter',
            'routes' => array(
                array(
                    'class'  => 'CFileLogRoute',
                    'levels' => 'trace',
                ),
                // uncomment the following to show log messages on web pages

                array(
                    'class'      => 'CWebLogRoute',
                    'levels'     => 'trace', //级别为trace
                    'categories' => 'system.db.*' //只显示关于数据库信息,包括数据库连接,数据库执行语句
                ),
            ),
        ),
    ),

    // application-level parameters that can be accessed
    // using Yii::app()->params['paramName']
    'params'            => array(
        // this is used in contact page
        'adminEmail' => 'webmaster@example.com',
    ),
    'defaultController' => 'Home',
    'layout'            => 'main',
);
