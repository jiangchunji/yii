# Host: localhost  (Version: 5.5.5-10.1.9-MariaDB)
# Date: 2016-05-25 14:54:50
# Generator: MySQL-Front 5.3  (Build 4.120)

/*!40101 SET NAMES utf8 */;

#
# Structure for table "system_authority"
#

DROP TABLE IF EXISTS `system_authority`;
CREATE TABLE `system_authority` (
  `id` int(11) NOT NULL DEFAULT '0',
  `menu_id` int(11) DEFAULT NULL,
  `controller` varchar(255) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `create_on` int(11) DEFAULT NULL,
  `create_by` varchar(255) DEFAULT NULL,
  `change_on` int(11) DEFAULT NULL,
  `change_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

#
# Data for table "system_authority"
#

/*!40000 ALTER TABLE `system_authority` DISABLE KEYS */;
INSERT INTO `system_authority` VALUES (30010001,300100,'Menu','Create','新增',NULL,NULL,NULL,NULL),(30010003,300100,'Menu','Edit','修改',NULL,NULL,NULL,NULL),(30010004,300100,'Menu','Search','查询',NULL,NULL,NULL,NULL),(30010005,300100,'Menu','AdSearch','高级查询',NULL,NULL,NULL,NULL),(30020001,300200,'Role','Create','新增',NULL,NULL,NULL,NULL),(30020002,300200,'Role','Delete','删除',NULL,NULL,NULL,NULL),(30020003,300200,'Role','Edit','修改',NULL,NULL,NULL,NULL),(30030001,300300,'LoginUser','Create','新增',NULL,NULL,NULL,NULL),(30030002,300300,'LoginUser','Delete','删除',NULL,NULL,NULL,NULL),(30030003,300300,'LoginUser','Edit','修改',NULL,NULL,NULL,NULL),(30030004,300300,'LoginUser','Search','查询',NULL,NULL,NULL,NULL),(30030005,300300,'LoginUser','AdSearch','高级查询',NULL,NULL,NULL,NULL),(30030006,300300,'LoginUser','Import','导入',NULL,NULL,NULL,NULL),(30040001,300400,'Authority','Create','新增',NULL,NULL,NULL,NULL),(30040003,300400,'Authority','Edit','修改',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `system_authority` ENABLE KEYS */;

#
# Structure for table "system_login_user"
#

DROP TABLE IF EXISTS `system_login_user`;
CREATE TABLE `system_login_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login_name` varchar(255) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  `nice_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `enable` int(1) DEFAULT NULL,
  `effective_date` int(11) DEFAULT NULL,
  `login_time` int(11) DEFAULT NULL,
  `change_pwd_time` int(11) DEFAULT NULL,
  `memo` varchar(255) DEFAULT NULL,
  `create_on` int(11) DEFAULT NULL,
  `create_by` varchar(255) DEFAULT NULL,
  `change_on` int(255) DEFAULT NULL,
  `change_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=63 DEFAULT CHARSET=utf8;

#
# Data for table "system_login_user"
#

/*!40000 ALTER TABLE `system_login_user` DISABLE KEYS */;
INSERT INTO `system_login_user` VALUES (61,'admin',1,'admin','e10adc3949ba59abbe56e057f20f883e',1,1446739200,NULL,NULL,'fe',NULL,NULL,NULL,NULL),(63,'jcj',2,'23','e10adc3949ba59abbe56e057f20f883e',1,1465509600,NULL,NULL,'2',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `system_login_user` ENABLE KEYS */;

#
# Structure for table "system_menu"
#

DROP TABLE IF EXISTS `system_menu`;
CREATE TABLE `system_menu` (
  `id` int(11) NOT NULL DEFAULT '0',
  `show_order` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `img_class` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `parent_key` int(11) DEFAULT NULL,
  `create_on` int(11) DEFAULT NULL,
  `create_by` varchar(255) DEFAULT NULL,
  `change_on` int(11) DEFAULT NULL,
  `change_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

#
# Data for table "system_menu"
#

/*!40000 ALTER TABLE `system_menu` DISABLE KEYS */;
INSERT INTO `system_menu` VALUES (300000,10,'系统管理','icon-config','',NULL,NULL,NULL,NULL,NULL),(300100,1,'菜单管理','','sys/Menu/Index',300000,NULL,NULL,NULL,NULL),(300200,2,'角色管理','','sys/Role/Index',300000,NULL,NULL,NULL,NULL),(300300,3,'用户管理','','sys/LoginUser/Index',300000,NULL,NULL,NULL,NULL),(300400,4,'权限管理','','sys/Authority/Index',300000,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `system_menu` ENABLE KEYS */;

#
# Structure for table "system_role"
#

DROP TABLE IF EXISTS `system_role`;
CREATE TABLE `system_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `parent_key` int(11) DEFAULT NULL,
  `enable` int(1) DEFAULT NULL,
  `memo` varchar(255) DEFAULT NULL,
  `create_on` int(11) DEFAULT NULL,
  `create_by` varchar(255) DEFAULT NULL,
  `change_on` int(11) DEFAULT NULL,
  `change_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

#
# Data for table "system_role"
#

/*!40000 ALTER TABLE `system_role` DISABLE KEYS */;
INSERT INTO `system_role` VALUES (1,'超级管理员',NULL,1,'',NULL,NULL,NULL,NULL),(2,'HR',NULL,1,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `system_role` ENABLE KEYS */;

#
# Structure for table "system_role_menu"
#

DROP TABLE IF EXISTS `system_role_menu`;
CREATE TABLE `system_role_menu` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `menu_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`role_id`,`menu_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

#
# Data for table "system_role_menu"
#

/*!40000 ALTER TABLE `system_role_menu` DISABLE KEYS */;
INSERT INTO `system_role_menu` VALUES (1,300000),(1,300100),(1,300200),(1,300300),(1,300400),(1,300400100),(2,300000),(2,300300);
/*!40000 ALTER TABLE `system_role_menu` ENABLE KEYS */;

#
# Structure for table "system_role_right"
#

DROP TABLE IF EXISTS `system_role_right`;
CREATE TABLE `system_role_right` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `au_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`role_id`,`au_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

#
# Data for table "system_role_right"
#

/*!40000 ALTER TABLE `system_role_right` DISABLE KEYS */;
INSERT INTO `system_role_right` VALUES (1,30010001),(1,30010003),(1,30010004),(1,30010005),(1,30020001),(1,30020002),(1,30020003),(1,30030001),(1,30030002),(1,30030003),(1,30030004),(1,30030005),(1,30030006),(1,30040001),(1,30040003),(2,30030002),(2,30030004),(2,30030005),(2,30030006);
/*!40000 ALTER TABLE `system_role_right` ENABLE KEYS */;

#
# Structure for table "system_test"
#

DROP TABLE IF EXISTS `system_test`;
CREATE TABLE `system_test` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "system_test"
#

