/* eslint-disable */

export const AllTypesProps = {
	UserRole: "enum",
	Query:{
		loginByPassword:{
			username:{
				type:"String",
				array:false,
				arrayRequired:false,
				required:true
			},
			password:{
				type:"String",
				array:false,
				arrayRequired:false,
				required:true
			}
		}
	},
	Mutation:{
		setAdministrator:{
			user:{
				type:"UserInput",
				array:false,
				arrayRequired:false,
				required:true
			}
		},
		addUserDesktopApp:{
			app:{
				type:"String",
				array:false,
				arrayRequired:false,
				required:true
			}
		},
		createGroup:{
			title:{
				type:"String",
				array:false,
				arrayRequired:false,
				required:true
			}
		},
		removeUserDesktopApp:{
			app:{
				type:"String",
				array:false,
				arrayRequired:false,
				required:true
			}
		},
		updateApp:{
			app:{
				type:"AppInput",
				array:false,
				arrayRequired:false,
				required:true
			}
		},
		updateGroup:{
			group:{
				type:"GroupInput",
				array:false,
				arrayRequired:false,
				required:true
			}
		},
		deleteGroup:{
			id:{
				type:"Float",
				array:false,
				arrayRequired:false,
				required:true
			}
		}
	},
	UserInput:{
		username:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		},
		password:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		},
		role:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:false
		}
	},
	AppInput:{
		name:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		},
		title:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		},
		icon:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		},
		group:{
			type:"Float",
			array:false,
			arrayRequired:false,
			required:false
		}
	},
	GroupInput:{
		id:{
			type:"Float",
			array:false,
			arrayRequired:false,
			required:true
		},
		title:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		}
	}
}

export const ReturnTypes = {
	Group:{
		id:"Float",
		title:"String"
	},
	App:{
		updatedAt:"Float",
		createdAt:"Float",
		enable:"Boolean",
		name:"String",
		title:"String",
		icon:"String",
		maximize:"Boolean",
		group:"Group"
	},
	User:{
		id:"Float",
		enable:"Boolean",
		updatedAt:"Float",
		createdAt:"Float",
		username:"String",
		password:"String",
		nickname:"String",
		role:"UserRole",
		desktop:"App"
	},
	ResultString:{
		result:"String"
	},
	ResultStringArray:{
		result:"String"
	},
	ResultBoolean:{
		result:"Boolean"
	},
	SystemInfo:{
		administrator:"Boolean",
		apps:"String"
	},
	Query:{
		loginByPassword:"ResultString",
		getUserByToken:"User",
		getSystemInfo:"SystemInfo",
		getAppList:"App",
		getGroupList:"Group"
	},
	Mutation:{
		setAdministrator:"ResultString",
		addUserDesktopApp:"ResultStringArray",
		createGroup:"Group",
		removeUserDesktopApp:"ResultStringArray",
		updateApp:"ResultBoolean",
		updateGroup:"ResultBoolean",
		deleteGroup:"ResultBoolean"
	}
}