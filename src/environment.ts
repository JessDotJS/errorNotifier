const BlockChains = ["main","test"];
const currencies_main =["btc","eth","doge","dash","ltc"];
const currencies_test = ["bcy","beth"];
const _currencies =[currencies_main,currencies_test];

const i=1; // 0 for main blockchain, 1 for test blockchain

const Config ={credential:{
			   	projectId: "vzla-dev",
				clientEmail: "firebase-adminsdk-6ohoc@vzla-dev.iam.gserviceaccount.com",
				privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDAGY+5c+emQNZM\n6eeKaqr/pZ1F8hGfb2gY1folenzp3UADffgiCidlbhnwSrik17nAQ5Nr4ZIWaRKE\nXnqd3uHPRb6h1XLlkn42MLL6qg98S0dLfraaf9Oik9k/SMDXeQTp0nsI89K1e9/D\ngQs7vJ22IAdNEyMwOnNPyo9K0pM0YG03ai0+UQ2aU63OPWrJntATHqOTsmKnUzT8\nbDSiqE+BtkyRLvA45/Rss9DwqZvU9+9sg2m2U19iQ9/hrekJ+hwEuxMYGaNgv/sh\nUXec4Wk4fHRscuzFXyNQUEby/xyAp6dqgr2vXwuEqwlkh/JXI3qq+B1+kx2u4Ky0\nD2TFRno/AgMBAAECggEAFTgdm0ogGfS1LJzKZzc+I+wK0dREjxHIHrTazfNYQ0rz\nDGUImNX59mccNWHuQG3V26ol6XeVYqVWQXSK4yULWLu8Vsr+8eM7JB2VVOvztvKS\ncavnBsI87ItGpt9l8ccxPD90OLpvbtLmljALFMenvMY6mDsXcCHcupZw5T5vuowF\nLUWMADTDzAbuGfQ25KSJad+WzMEDFYN10pjzB4aAdUJJc0wehMvevJjiv0Mxp08s\nwWv52v40erKjggy1sDJiq1RkZehrBsL1K/bQ05T9T7BYsKqkYKrd00kOB618lU7q\nk80I4p+1Ax2cYj5DRNyND3g4DrcuHILL+ho02kt3NQKBgQDmczn98IAnrytkOQdx\nnmzb8qOAPK/K6zRoLM+ThRcA/ZpaEOw8eydAJ9aYp0b9N1mOTOPyrdY0KBPykF3z\nCipVEZBd9xiVnOZw1zldPtLMHQRx1oj1xxzdFoZTr9v62SqTjb6kwbuzoVgkAcWR\nClrIgajO7Q2KPGUw7pWAgn/yQwKBgQDVZdrbBkjZlY2BDdpbzTzU6ojMvzPfA6uW\nMMS6CqKqKw/YfQi+Efxj4jze+kMervDfnsBTQ69NlIYxso2sTkGgtXGw6n4MGj4a\niePI4GaHxWaoLd0aU+fhYFhJpvYFuwDQvcKkEic2tjg4bfndTu+KDYoxCV76Lqo3\nY3Fh6wEuVQKBgCTAs7sAJDAwC6eMQNeqAIqDg/frtc2S/WSv4NsSGr0ZtQgwMrzi\nlzvwHpVx+CxiK3I6aRBHESZ4TdYdmB4uvNmcV33k7pLN1yKf8JIidtP+vLq7EFTC\nUKQh94JZRagYAmZN8N2t2BWp4bi8X5nmINxhcV6vB73ILAtFwaohJe6pAoGAYd+H\nUzE8tF69OdWKstQc9GJlP9LqDXz3c7kGYXWDSZzadaZTHinNolofJP2PT0FZRJbh\nCs9eVayrJ5wHEmIKA5V0gXnrOc3HchCQIo+ZNug4vyXZ5Lta/KldlNo4uEQeiZ6e\n6PVSeut0OZ1nHjOX9a9kFD2CDCje9OxtEkXgkskCgYEAoMSrjXhNsfWx24KY8r0r\nPOjl1ApsGwzCp83QJx6f9dUS3vc0qrFM10JSYuv7K2YzQTR4avTAuSbWOM/x4Udb\nqYMNbbSqJmowwwYDmFCiUWf/OKtzPJDlR8rtEcGJZUCBDd31vVkgO/DOfTo3rm2P\nmKvMaTECD1AlHOU/ISE+X7M=\n-----END PRIVATE KEY-----\n"	  
				},
			   databaseURL: "https://vzla-dev.firebaseio.com"
   			  };
const BlockChain=BlockChains[i];
const Currencies = _currencies[i];
const BlockCypherToken ="87e0038b38864af6a40705e47f22d209";

export const environment = {blockChain:BlockChain,
							firebaseConfig:Config,
							currencies:Currencies,
							blockCypherToken:BlockCypherToken};