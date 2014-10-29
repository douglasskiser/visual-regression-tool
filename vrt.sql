-- MySQL dump 10.13  Distrib 5.5.37, for debian-linux-gnu (i686)
--
-- Host: localhost    Database: vrt
-- ------------------------------------------------------
-- Server version	5.5.37-0ubuntu0.13.10.1
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO,ANSI' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table "Box"
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE "Box" (
  "id" int(11) NOT NULL,
  "url" varchar(255) NOT NULL,
  "name" varchar(255) NOT NULL,
  "createdAt" bigint(20) NOT NULL,
  "updatedAt" bigint(20) NOT NULL,
  PRIMARY KEY ("id")
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table "Box"
--

INSERT INTO "Box" VALUES (1,'https://wl25-int.sabresonicweb.com/SSW2010/EYM0/#webqtrip','INT-WL25-EYM0',2014,2014);
INSERT INTO "Box" VALUES (2,'https://wl16-int.sabresonicweb.com/SSW2010/EYM0/#webqtrip/e1s1','INT-WL16-EYM0',0,0);
INSERT INTO "Box" VALUES (3,'https://mobile1-b-test.sabresonicweb.com/SSW2010/EYM0/#webqtrip','CERT-B-EYM0',0,0);

--
-- Table structure for table "Device"
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE "Device" (
  "id" int(11) NOT NULL,
  "name" varchar(255) NOT NULL,
  "width" int(10) unsigned NOT NULL,
  "height" int(10) unsigned NOT NULL,
  PRIMARY KEY ("id")
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table "Device"
--

INSERT INTO "Device" VALUES (1,'Apple iPhone 5',320,568);
INSERT INTO "Device" VALUES (2,'Apple iPad 3/4',1024,768);

--
-- Table structure for table "Execution"
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE "Execution" (
  "id" int(11) NOT NULL,
  "oldBoxId" int(11) NOT NULL,
  "newBoxId" int(11) NOT NULL,
  "scriptId" int(11) NOT NULL,
  "deviceId" int(11) NOT NULL,
  "createdAt" bigint(20) NOT NULL,
  "updatedAt" bigint(20) NOT NULL,
  "status" int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY ("id"),
  KEY "oldBoxId" ("oldBoxId"),
  KEY "scriptId" ("scriptId"),
  KEY "newBoxId" ("newBoxId"),
  KEY "deviceId" ("deviceId"),
  CONSTRAINT "Execution_ibfk_1" FOREIGN KEY ("oldBoxId") REFERENCES "Box" ("id"),
  CONSTRAINT "Execution_ibfk_2" FOREIGN KEY ("scriptId") REFERENCES "Script" ("id"),
  CONSTRAINT "Execution_ibfk_3" FOREIGN KEY ("newBoxId") REFERENCES "Box" ("id"),
  CONSTRAINT "Execution_ibfk_4" FOREIGN KEY ("deviceId") REFERENCES "Device" ("id")
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table "Execution"
--

INSERT INTO "Execution" VALUES (1,3,2,1,1,1412622784441,1412799659848,20);
INSERT INTO "Execution" VALUES (2,3,2,1,1,1412631353379,1412725333376,0);
INSERT INTO "Execution" VALUES (3,3,2,1,1,1412631400039,1412631400039,0);
INSERT INTO "Execution" VALUES (4,3,2,1,1,1412631422209,1412631422209,0);
INSERT INTO "Execution" VALUES (5,3,2,1,1,1412631491599,1412631491599,0);
INSERT INTO "Execution" VALUES (6,3,2,1,1,1412633931542,1412633931542,0);
INSERT INTO "Execution" VALUES (7,3,2,1,1,1412634022128,1412634022128,0);
INSERT INTO "Execution" VALUES (8,3,2,1,1,1412634101054,1412634101054,0);
INSERT INTO "Execution" VALUES (9,3,2,1,1,1412634134889,1412634134889,0);
INSERT INTO "Execution" VALUES (10,3,2,1,1,1412634214445,1412634214445,0);
INSERT INTO "Execution" VALUES (11,3,2,1,1,1412634239651,1412799863242,20);
INSERT INTO "Execution" VALUES (12,3,2,1,1,1412636130038,1412801289790,20);
INSERT INTO "Execution" VALUES (13,3,2,1,1,1412636165715,1412735968549,0);
INSERT INTO "Execution" VALUES (14,3,2,1,1,1412636191134,1412736077737,0);
INSERT INTO "Execution" VALUES (15,1,2,1,1,1412707870925,1412782457735,20);
INSERT INTO "Execution" VALUES (16,2,3,1,1,1412710666199,1412779135560,0);
INSERT INTO "Execution" VALUES (17,3,2,1,2,1412711290286,1412800150747,20);
INSERT INTO "Execution" VALUES (18,3,2,1,2,1412717955321,1412725564633,0);
INSERT INTO "Execution" VALUES (19,2,1,1,1,1412736062505,1412778957426,0);

--
-- Table structure for table "Script"
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE "Script" (
  "id" int(11) NOT NULL,
  "name" varchar(255) NOT NULL,
  "path" varchar(255) NOT NULL,
  "createdAt" bigint(20) NOT NULL,
  "updatedAt" bigint(20) NOT NULL,
  "nbOfScreenshots" int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY ("id")
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table "Script"
--

INSERT INTO "Script" VALUES (1,'Booking','ssw/booking.js',2014,2014,13);

--
-- Table structure for table "ScriptBox"
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE "ScriptBox" (
  "id" int(11) NOT NULL,
  "boxId" int(11) NOT NULL,
  "scriptId" int(11) NOT NULL,
  "createdAt" bigint(20) NOT NULL,
  "updatedAt" bigint(20) NOT NULL,
  PRIMARY KEY ("id"),
  KEY "boxId" ("boxId"),
  KEY "scriptId" ("scriptId"),
  CONSTRAINT "ScriptBox_ibfk_1" FOREIGN KEY ("boxId") REFERENCES "Box" ("id"),
  CONSTRAINT "ScriptBox_ibfk_2" FOREIGN KEY ("scriptId") REFERENCES "Script" ("id")
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table "ScriptBox"
--

INSERT INTO "ScriptBox" VALUES (1,1,1,2014,2014);
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-10-08 17:43:37
