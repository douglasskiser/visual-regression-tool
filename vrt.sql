-- MySQL dump 10.13  Distrib 5.1.73, for redhat-linux-gnu (x86_64)
--
-- Host: localhost    Database: vrt
-- ------------------------------------------------------
-- Server version       5.1.73

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Box`
--

DROP TABLE IF EXISTS `Box`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Box` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` bigint(20) NOT NULL,
  `updatedAt` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Box`
--

LOCK TABLES `Box` WRITE;
/*!40000 ALTER TABLE `Box` DISABLE KEYS */;
INSERT INTO `Box` VALUES (1,'https://wl25-int.sabresonicweb.com/SSW2010/EYM0/#webqtrip','INT-WL25-EYM0',2014,2014),(2,'https://wl16-int.sabresonicweb.com/SSW2010/EYM0/#webqtrip','INT-WL16-EYM0',0,1416255695903),(3,'https://mobile1-b-test.sabresonicweb.com/SSW2010/EYM0/#webqtrip','CERT-B-EYM0',0,0),(4,'https://mobile1-a-test.sabresonicweb.com/SSW2010/EYM0/#webqtrip','CERT-A-EYM0',0,0),(5,'https://wl23-int.sabresonicweb.com/SSW2010/EYM0/#webqtrip','INT-WL23 EYM0/BMF',1416241597371,1416274882785),(7,'https://wl13-int.sabresonicweb.com/SSW2010/EYM0/#webqtrip','WL13-INT EYM0 BMF',1416275180386,1416275180386),(8,'https://mobile1-b-test.sabresonicweb.com/SSW2010/EYM0/#checkin','mobile1-b-test.sabresonicweb.com - EYM0 - Check In',1416518806951,1416518806951),(9,'https://wl16-int.sabresonicweb.com/SSW2010/EYM0/#checkin','wl16-int.sabresonicweb.com - EYM0 - Check In',1416518852515,1416518852515);
/*!40000 ALTER TABLE `Box` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Device`
--

DROP TABLE IF EXISTS `Device`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Device` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `width` int(10) unsigned NOT NULL,
  `height` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Device`
--

LOCK TABLES `Device` WRITE;
/*!40000 ALTER TABLE `Device` DISABLE KEYS */;
INSERT INTO `Device` VALUES (1,'Apple iPhone 5',320,568),(2,'Apple iPad 3/4',1024,768);
/*!40000 ALTER TABLE `Device` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Execution`
--

DROP TABLE IF EXISTS `Execution`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Execution` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `jobId` int(11) NOT NULL,
  `statusId` int(10) unsigned NOT NULL,
  `createdAt` bigint(20) NOT NULL,
  `updatedAt` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobId` (`jobId`),
  KEY `statusId` (`statusId`),
  CONSTRAINT `FK_Execution_jobId` FOREIGN KEY (`jobId`) REFERENCES `Job` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_Execution_statusId` FOREIGN KEY (`statusId`) REFERENCES `ExecutionStatus` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Execution`
--

LOCK TABLES `Execution` WRITE;
/*!40000 ALTER TABLE `Execution` DISABLE KEYS */;
INSERT INTO `Execution` VALUES (2,1,3,1415943499592,1415950119433),(3,3,3,1415950583413,1415950672141),(4,3,3,1415950816449,1415950905257),(5,3,3,1415950959849,1415951045818),(6,3,3,1415951217180,1415951311141),(7,3,4,1415951792372,1415951885240),(8,3,5,1415951909661,1415951914706),(9,3,3,1415952004494,1415952091864),(10,3,3,1415952223248,1415986099009),(12,3,4,1415980719593,1415990847948),(13,3,3,1415991086317,1415992728620),(14,3,3,1415993175147,1415997895264),(15,4,3,1415998028264,1418683151469),(16,3,3,1415999692821,1415999716914),(17,1,3,1415999813671,1415999839269),(18,4,3,1415999914326,1415999939279),(19,5,3,1416000824866,1416000849283),(20,6,3,1416001136003,1416001162884),(21,7,3,1416002171331,1416002193949),(22,2,3,1416002225387,1416002438875),(23,8,3,1416003450395,1416003474745),(24,2,3,1416003543934,1416253651230),(25,3,3,1416255421120,1416257469110),(26,9,3,1416257087994,1416257231000),(27,9,3,1416258255282,1416273704458),(28,1,3,1416273728457,1416274012230),(29,10,4,1416274917306,1416275014750),(30,11,3,1416275203100,1416517382678),(32,12,3,1416518887072,1416518916845),(33,1,3,1416872044200,1416873172172),(34,2,3,1416925217334,1416925455549),(35,13,5,1416926923909,1418248360883),(36,1,3,1417824952837,1418412829164),(37,12,3,1418413559678,1418415255525),(38,14,4,1418662018699,1418662051416),(39,14,3,1418662165744,1418662400957),(40,16,3,1418702707785,1418702975415),(41,16,3,1418802883012,1418803154553),(42,17,4,1421422678333,1421423064017),(44,19,4,1422038574790,1422039053036);
/*!40000 ALTER TABLE `Execution` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ExecutionStatus`
--

DROP TABLE IF EXISTS `ExecutionStatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ExecutionStatus` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ExecutionStatus`
--

LOCK TABLES `ExecutionStatus` WRITE;
/*!40000 ALTER TABLE `ExecutionStatus` DISABLE KEYS */;
INSERT INTO `ExecutionStatus` VALUES (1,'Scheduled'),(2,'Running'),(3,'Completed'),(4,'Error'),(5,'Terminated');
/*!40000 ALTER TABLE `ExecutionStatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HealthCheck`
--

DROP TABLE IF EXISTS `HealthCheck`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `HealthCheck` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `boxId` int(11) NOT NULL,
  `status` int(10) unsigned NOT NULL DEFAULT '0',
  `updatedAt` bigint(20) DEFAULT NULL,
  `createdAt` bigint(20) DEFAULT NULL,
  `script` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_HealthCheck_boxId` (`boxId`),
  CONSTRAINT `FK_HealthCheck_boxId` FOREIGN KEY (`boxId`) REFERENCES `Box` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HealthCheck`
--

LOCK TABLES `HealthCheck` WRITE;
/*!40000 ALTER TABLE `HealthCheck` DISABLE KEYS */;
INSERT INTO `HealthCheck` VALUES (1,1,0,1415220213552,1415119786318,'var Utils = require(\'../utils\'),\n    startUrl = casper.cli.options.url,\n    casper = require(\'casper\').create({\n        logLevel: \'info\',\n        waitTimeout: 30000,\n        pageSettings: {\n            webSecurityEnabled: false,\n            loadImages: true,\n            loadPlugins: false\n        }\n    });\n\n\n\n//on resource.error, call error reporting and exit\ncasper.on(\'resource.error\', function(e) {\n    Utils.handleError(e);\n    casper.exit();\n});\n\n//start casper\ncasper.start(startUrl);\n\n/********************** YOUR SCRIPT STARTS HERE *******************************/\ncasper.waitFor(function() {\n    return casper.evaluate(function() {\n        return !$(\'#loading\').is(\':visible\') && !$(\'#overlay\').is(\':visible\') && $(\'#search-flights\').is(\':visible\') && $(\'#departure-airport>option\').size() > 0;\n    });\n});\n\ncasper.then(function() {\n    casper.evaluate(function() {\n        var e = $(\'#departure-airport\');\n        e.val(\'AUH\');\n        e.change();\n    });\n});\n/********************** YOUR SCRIPT ENDS HERE *******************************/\ncasper.run(function() {\n    Utils.handleSuccess();\n    casper.exit();\n});');
/*!40000 ALTER TABLE `HealthCheck` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Job`
--

DROP TABLE IF EXISTS `Job`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Job` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `oldBoxId` int(11) NOT NULL,
  `newBoxId` int(11) DEFAULT NULL,
  `scriptId` int(11) NOT NULL,
  `deviceId` int(11) DEFAULT NULL,
  `createdAt` bigint(20) NOT NULL,
  `updatedAt` bigint(20) NOT NULL,
  `typeId` int(10) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `oldBoxId` (`oldBoxId`),
  KEY `scriptId` (`scriptId`),
  KEY `newBoxId` (`newBoxId`),
  KEY `deviceId` (`deviceId`),
  KEY `FK_Execution_typeId` (`typeId`),
  CONSTRAINT `FK_Job_typeId` FOREIGN KEY (`typeId`) REFERENCES `JobType` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_Job_oldBoxId` FOREIGN KEY (`oldBoxId`) REFERENCES `Box` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_Job_scriptId` FOREIGN KEY (`scriptId`) REFERENCES `Script` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_Job_newBoxId` FOREIGN KEY (`newBoxId`) REFERENCES `Box` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_Job_deviceId` FOREIGN KEY (`deviceId`) REFERENCES `Device` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Job`
--

LOCK TABLES `Job` WRITE;
/*!40000 ALTER TABLE `Job` DISABLE KEYS */;
INSERT INTO `Job` VALUES (1,3,2,8,1,1415941678354,1415941678354,1),(2,3,2,8,2,1415942592721,1415942592721,1),(3,4,2,8,1,1415950573386,1415950573386,1),(4,3,2,8,2,1415998026447,1415998026447,1),(5,3,2,8,1,1416000820412,1416000820412,1),(6,3,2,8,1,1416001132361,1416001132361,1),(7,3,2,8,1,1416002169791,1416002169791,1),(8,3,2,8,1,1416003446858,1416003446858,1),(9,5,2,8,1,1416257034316,1416257034316,2),(10,5,2,8,1,1416274915622,1416274915622,1),(11,2,7,8,1,1416275201464,1416275201464,1),(12,8,9,11,1,1416518600718,1416518878087,1),(13,2,3,8,2,1416926908785,1416926908785,1),(14,3,2,8,1,1418415266930,1418662163014,1),(15,3,2,8,1,1418682863670,1418682863670,1),(16,3,2,8,1,1418702705426,1418702705426,1),(17,1,5,8,1,1421422676127,1421422676127,1),(18,1,5,11,1,1421423191351,1421423191351,1),(19,1,7,8,1,1422038573109,1422038573109,1);
/*!40000 ALTER TABLE `Job` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `JobType`
--

DROP TABLE IF EXISTS `JobType`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `JobType` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `scriptTemplate` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `JobType`
--

LOCK TABLES `JobType` WRITE;
/*!40000 ALTER TABLE `JobType` DISABLE KEYS */;
INSERT INTO `JobType` VALUES (1,'Visual Regression',NULL),(2,'Health Check',NULL);
/*!40000 ALTER TABLE `JobType` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Script`
--

DROP TABLE IF EXISTS `Script`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Script` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` bigint(20) NOT NULL,
  `updatedAt` bigint(20) NOT NULL,
  `nbOfScreenshots` int(10) unsigned NOT NULL DEFAULT '0',
  `code` longtext NOT NULL,
  `typeId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_Script_typeId` (`typeId`),
  CONSTRAINT `Script_ibfk_1` FOREIGN KEY (`typeId`) REFERENCES `JobType` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Script`
--

LOCK TABLES `Script` WRITE;
/*!40000 ALTER TABLE `Script` DISABLE KEYS */;
INSERT INTO `Script` VALUES (8,'BMF',1415922026559,1422038905447,0,'var casper = require(\'casper\').create({\n        logLevel: \'info\',\n        waitTimeout: 30000,\n        pageSettings: {\n            webSecurityEnabled: false,\n            loadImages: true,\n            loadPlugins: false\n        }\n    }),\n    Camera = new require(\'../../camera\'),\n    camera = new Camera(casper, casper.cli.options.target),\n    startUrl = casper.cli.options.url;\n\ncasper.echo(\"Start requesting \" + startUrl);\ncasper.start(startUrl);\ncasper.viewport(casper.cli.options.width, casper.cli.options.height);\n\ncasper.waitFor(function() {\n    return casper.evaluate(function() {\n        return !$(\'#loading\').is(\':visible\') && !$(\'#overlay\').is(\':visible\') && $(\'#search-flights\').is(\':visible\') && $(\'#departure-airport>option\').size() > 0;\n    });\n});\n\ncasper.wait(5000);\n\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'Air Search Page\');\n});\n\ncasper.then(function() {\n    casper.evaluate(function() {\n        var e = $(\'#departure-airport\');\n        e.val(\'AUH\');\n        e.change();\n    });\n});\n\ncasper.waitFor(function() {\n    return casper.evaluate(function() {\n        return !$(\'#loading\').is(\':visible\') && !$(\'#overlay\').is(\':visible\') && $(\'#arrival-airport\').find(\'option\').size() > 1;\n    })\n});\n\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'Air Search Page - Departure Airport selected\');\n});\n\ncasper.then(function() {\n    casper.echo(\"Set the arrival airport to be the first item in the list\'\");\n    casper.evaluate(function() {\n        var arrivalAirport = $(\'#arrival-airport\');\n        arrivalAirport.val(\"DFW\");\n    });\n});\n\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'Air Search Page - Arrival Airport selected\');\n});\n\n\ncasper.then(function() {\n    casper.echo(\"Set departure and arrival date click \'Search for Flights\'\");\n    casper.evaluate(function() {\n        //setting the dates 6 months from now\n        var start = new Date();\n        start.setMonth(start.getMonth() + 6);\n        start.setDate(1);\n        var end = new Date();\n        end.setMonth(end.getMonth()+7);\n        end.setDate(0);\n\n        $(\'#departure-date\').val(Sabre.app.formatDate(start, \"%Y/%m/%d\"));\n        $(\'#return-date\').val(Sabre.app.formatDate(end, \"%Y/%m/%d\"));\n        $(\'#search-flights\').click();\n    });\n});\n\ncasper.waitFor(function() {\n    return casper.evaluate(function() {\n        return !$(\'#loading\').is(\':visible\') && !$(\'#overlay\').is(\':visible\') && document.title === \'Air Select Page\' && $($(\'.d-outbound .choose-flight\')[0]).is(\':visible\');\n    })\n});\n\ncasper.wait(10000);\n\ncasper.then(function() {\n    casper.echo(\'Select the first OUTBOUND flight\');\n    casper.evaluate(function() {\n        $($(\'.d-outbound .choose-flight\')[0]).click();\n    });\n});\n\ncasper.wait(10000);\n\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'Air Select Page - Outbound flight selected\');\n});\n\ncasper.then(function() {\n    casper.echo(\'Select the first class of service for OUTBOUND flight\');\n    casper.evaluate(function() {\n        $($(\'.d-outbound .select-flight\')[0]).click();\n    });\n});\n\ncasper.wait(10000);\n\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'Air Select Page - Selected Outbound Class of Service\');\n\n});\n\ncasper.then(function() {\n    casper.echo(\'Select the first INBOUND flight\');\n    casper.evaluate(function() {\n        $($(\'.d-inbound .choose-flight\')[0]).click();\n    });\n});\n\ncasper.wait(10000);\n\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'Air Select Page - Inbound Flight selected\');\n\n});\n\ncasper.then(function() {\n    casper.echo(\'Select the first class of service for INBOUND flight\');\n    casper.evaluate(function() {\n        $($(\'.d-inbound .select-flight\')[0]).click();\n    });\n});\n\ncasper.wait(10000);\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'Air Select Page - Selected Inbound Class of Service\');\n\n});\n\n\ncasper.then(function() {\n    casper.echo(\'Click on \"Purchase Flight\"\');\n    casper.evaluate(function() {\n        $(\'#confirmFlights\').click();\n    });\n});\n\ncasper.waitFor(function() {\n    return casper.evaluate(function() {\n        return !$(\'#loading\').is(\':visible\') && !$(\'#overlay\').is(\':visible\') && document.title === \'Passengers Page\';\n    })\n});\n\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'Passengers Page - Home\');\n});\n\ncasper.then(function() {\n    casper.echo(\'Click on add details\');\n    casper.evaluate(function() {\n        $(\'.show-psng-form\').click();\n       \n    });\n});\ncasper.wait(10000);\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'Passengers Page - Passenger details form\');\n});\n\n\ncasper.then(function(){\n    casper.echo(\"Fill in the passenger form\");\n    casper.evaluate(function(){\n        var form = $(\'#psng-edit-form\');\n        form.find(\'.field-prefix\').val(\'MR\');\n        form.find(\'.field-firstName\').val(\'John\');\n        form.find(\'.field-lastName\').val(\'Doe\');\n        form.find(\'.field-dob\').val(\'1944-07-31\');\n        form.find(\'.field-phone\').val(\'8171112222\');\n        form.find(\'.field-email\').val(\'test@testsabre.com\');\n    })\n});\n\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'Passengers Page - Filled passenger details form\');\n});\ncasper.then(function(){\n    casper.echo(\"Click on Continue\");\n    casper.evaluate(function(){\n        var form = $(\'#psng-edit-form\');\n        form.find(\'.save-psng\').click();\n    })\n});\n\ncasper.wait(10000);\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'Passengers Page - Passenger details added\');\n});\n\ncasper.then(function() {\n    casper.echo(\'Click on \"Continue\"\');\n    casper.evaluate(function() {\n        $(\'.psng-section .btn-primary\').click();\n    });\n});\n\ncasper.waitFor(function() {\n    return casper.evaluate(function() {\n        return !$(\'#loading\').is(\':visible\') && !$(\'#overlay\').is(\':visible\') && document.title === \'Ancillary Page\';\n    });\n});\n\ncasper.wait(10000);\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'Ancillary Page - Home\');\n});\n\n\n\ncasper.run(function() {\n    casper.echo(\"CASPER COMPLETED.\");\n    casper.exit();\n});',1),(11,'Check In',1415922326405,1418417933311,0,'var casper = require(\'casper\').create({\n        logLevel: \'info\',\n        waitTimeout: 30000,\n        pageSettings: {\n            webSecurityEnabled: false,\n            loadImages: true,\n            loadPlugins: false\n        }\n    }),\n    Camera = new require(\'../../camera\'),\n    camera = new Camera(casper, casper.cli.options.target),\n    startUrl = casper.cli.options.url;\n\ncasper.echo(\"Start requesting \" + startUrl);\ncasper.start(startUrl);\ncasper.viewport(casper.cli.options.width, casper.cli.options.height);\n\n\ncasper.waitFor(function() {\n    return casper.evaluate(function() {\n        return !$(\'#loading\').is(\':visible\') && !$(\'#overlay\').is(\':visible\') && $(\'#search\').is(\':visible\');\n    });\n});\n\ncasper.wait(5000);\n\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'CheckIn - Home Page\');\n});\n\ncasper.then(function(){\n    casper.echo(\"Setting PNR to ABC123\");\n    return casper.evaluate(function(){\n        $(\'[name=pnr]\').val(\'ABC\');\n    });\n});\n\ncasper.then(function() {\n    camera.capture(\'#app-container\', \'CheckIn - Home Page After setting PNR\');\n});\n\ncasper.run(function() {\n    casper.echo(\"CASPER COMPLETED.\");\n    casper.exit();\n});',1),(14,'Test health check script',1415927120884,1415939767391,0,'var x = new Y();',2);
/*!40000 ALTER TABLE `Script` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-01-26 11:05:41
