var favMovies = new Firebase('https://addmovie-5e224.firebaseio.com');

function saveToList(event){
	if(event.which == 13 || event.KeyCode == 13){
		var movieName = document.getElementById('movieName').value.trim();
		if(movieName.length > 0){
			// var li = '<li>'+movieName+'</li>';
			// document.getElementById("favMovies").innerHTML += li;
			saveToFB(movieName);
		}
		document.getElementById("movieName").value = "";
		return false;
	}
};

function saveToFB(movieName){
	favMovies.push({
		name:movieName
	});
};

function refreshUI(list){
	//console.log("generate list");
	var lt = '';
	for(var i=0;i<list.length;i++){
		lt+= '<li data-key="'+list[i].key+'">'+list[i].name+ '['+getLinks(list[i].key,list[i].name)+']</li>';
	};
	document.getElementById('favMovies').innerHTML = lt;
	console.log(list);
	//console.log(lt);
};

function getLinks(key,name){
	var links = '';
	links += '<a href="javascript:edit(\'' + key + '\',\'' + name + '\')">Edit</a> | ';
	links += '<a href="javascript:del(\'' + key + '\',\'' + name + '\')">Delete</a>';
	//links += '<a href="javascript:edit(\''+key+'\',\''+mvName+'\')">Edit</a> | ';
	//links += '<a href="javascript:del(\''+key+'\',\''+mvName+'\')">Delete</a>';
	return links;
};

function edit(key,name){
	var movieName = prompt("Update the movie name:",name);
	if(movieName && movieName.length>0){
		var updateMovieRef = buildEndPoint(key);
		updateMovieRef.update({
			name:movieName
		});
	}
};

function del(key,name){
	var response = confirm("Are you confirm about removing \""+name+"\"from the list?");
	if(response == true){
		var deleteMovieRef = buildEndPoint(key);
		deleteMovieRef.remove();
	}
};

function buildEndPoint(key){
	return new Firebase('https://addmovie-5e224.firebaseio.com/'+key);
}

favMovies.on("value",function(snapshot){
	var data = snapshot.val();
	//console.log(data);
	var list = [];
	//console.log(list);
	for(var key in data){
		if(data.hasOwnProperty(key)){
			name = data[key].name?data[key].name:'';
			//console.log(name);
			if(name.trim().length>0){
				list.push({
					name:name,
					key:key
				})
			}
		}
	}
	refreshUI(list);
	//console.log(list);
});