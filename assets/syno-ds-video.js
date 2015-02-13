var videoStation = {
  debug: 0,
  ip: '192.168.1.139',
  port: '5000',
  protocol: 'http',
  account: 'admin',
  password: 'admin',

  movieList: {
    join: 'l20',
    posterJoins: ['s1', 's11', 's21', 's31', 's41'],
    titleJoins: ['s2', 's12', 's22', 's32', 's42'],
    idJoins: ['s3', 's13', 's23', 's33', 's43'],
    buttonJoins: { 'd1': 0, 'd11': 1, 'd21': 2, 'd31': 3, 'd41': 4 },
    typeJoins: ['s4', 's14', 's24', 's34', 's44'],
    rowSize: 5
  },
  movieDetails: {
    posterJoin: 's100',
    titleJoin: 's101',
    dateJoin: 's102',
    taglineJoin: 's103',
    summaryJoin: 's104',
    genreList: 'l21',
    actorList: 'l22',
    directorList: 'l23',
    writerList: 'l24',
  },
 
  pluginSearch: {
    preferlanguage: 'enu', // rus - russian, enu - english
    inputJoin: 's106',
    resultList: 'l25',
  },
  movieEdit: {
    posterJoin: 's114',
    titleJoin: 's107',
    taglineJoin: 's108',
    genreJoin: 's109',
    actorJoin: 's110',
    directorJoin: 's111',
    writerJoin: 's112',
    summaryJoin: 's113',
    availableJoin: 's115',
    // for CF.getJoins function
    joinArray: ['s106', 's107', 's108', 's109', 's110', 's111', 's112', 's113', 's114', 's115'],
  },
  deviceList: 'l27',
  fileList: 'l28',
  subtitleList: 'l29',

  movieSearch: {
    filterListJoin: 'l26',
    inputJoin: 's116',
    filters: {
      year: {
        title: 'Year', // title that is shown in list
        parameter: 'year', // parameter that will be sent in request parameter = value
        value: [] // selected values
      },
      director: {
        title: 'Director',
        parameter: 'director',
        value: []
      },
      writer: {
        title: 'Writer',
        parameter: 'writer',
        value: []
      },
      actor: {
        title: 'Actor',
        parameter: 'actor',
        value: []
      },
      genre: {
        title: 'Genre',
        parameter: 'genre',
        value: []
      },
      container: {
        title: 'Container',
        parameter: 'container',
        value: []
      },
    }, 
  },
  // array of visited folders
  browseHistory: [''],

  init: function() {
    // first, get api list and info
    var that = this;
    this.log('REQUEST API INFO');
    var parameters = {
      'api' : 'SYNO.API.Info',
      'path' : 'query.cgi',
      'method' : 'query',
      'version' : '1',
      'query' : 'all'
    };
    this.request(parameters, function(status, headers, body) {
      that.parseApiInfoResponse(status, headers, body);
      // after parsing api information request login
      that.log('REQUEST AUTHORIZATION');
      var parameters = {
        'api' : 'SYNO.API.Auth',
        'method' : 'login',
        'version' : '2',
        'account' : that.account,
        'passwd' : that.password,
        'session' : 'VideoStation',
        'format' : 'cookie'
      };
      that.request(parameters, function(status, headers, body) {
        that.parseLogin(status, headers, body);
      });
    });
  },

  libraryRequest: function(parameters, callback) {
    var that = this;
    this.log('LIBRARY REQUEST');
    //var requestParameters = parameters;
    parameters.api = 'SYNO.VideoStation.Library';
    if (parameters.method === undefined) {
      parameters.method = 'list';
    }
    if (parameters.offset === undefined) {
      parameters.offset = '0';
    }
    if (parameters.limit === undefined) {
      parameters.limit = '1000';
    }
    parameters.version = 1;
    this.request(parameters, function(status, headers, body) {
      that.log(status);
      that.log(headers);
      that.log(body);
      if (callback !== undefined) {
        if (typeof callback === 'function') {
          callback(status, headers, body);
        }
      }
    });
  },
  posterRequest: function(parameters, callback) {
    var that = this;
    this.log('POSTER REQUEST');
    //var requestParameters = parameters;
    parameters.api = 'SYNO.VideoStation.Poster';
    this.request(parameters, function(status, headers, body) {
      that.log(status);
      that.log(headers);
      that.log(body);
      if (callback !== undefined) {
        if (typeof callback === 'function') {
          callback(status, headers, body);
        }
      }
    });
  },
  pluginSearchRequest: function(parameters, callback) {
    var that = this;
    this.log('PLUGIN SEARCH REQUEST');
    //var requestParameters = parameters;
    parameters.api = 'SYNO.VideoStation.PluginSearch';
    if (parameters.method === undefined) {
      parameters.method = 'list';
    }
    if (parameters.method === 'list') {
      if (parameters.offset === undefined) {
        parameters.offset = '0';
      }
      if (parameters.limit === undefined) {
        parameters.limit = '500';
      }
      if (parameters.sort_by === undefined) {
        parameters.sort_by = 'title';
      }
      if (parameters.sort_direction === undefined) {
        parameters.sort_direction = 'asc';
      }
    }
    if (parameters.method === 'start') {
      if (parameters.preferlanguage === undefined) {
        parameters.preferlanguage = 'eng';
      }
    }
    // if (parameters.limit === undefined) {
    //   parameters.limit = '1000';
    // }
    parameters.version = 1;
    this.request(parameters, function(status, headers, body) {
      that.log(status);
      that.log(headers);
      that.log(body);
      if (callback !== undefined) {
        if (typeof callback === 'function') {
          callback(status, headers, body);
        }
      }
    });
  },
  folderRequest: function(parameters, callback) {
    var that = this;
    this.log('Folder REQUEST');
    //var requestParameters = parameters;
    parameters.api = 'SYNO.VideoStation.Folder';
    if (parameters.method === undefined) {
      parameters.method = 'list';
    }
    if (parameters.sort_by === undefined) {
      parameters.sort_by = 'title';
    }
    if (parameters.offset === undefined) {
      parameters.offset = '0';
    }
    if (parameters.limit === undefined) {
      parameters.limit = '1000';
    }
    if (parameters.sort_direction === undefined) {
      parameters.sort_direction = 'asc';
    }
    if (parameters.library_id === undefined) {
      parameters.library_id = '0';
    }
    if (parameters.type === undefined) {
      parameters.type = 'movie';
    }
    if (parameters.id === undefined) {
      parameters.id = '';
    }
    parameters.version = 1;
    this.request(parameters, function(status, headers, body) {
      that.log(status);
      that.log(headers);
      that.log(body);
      if (callback !== undefined) {
        if (typeof callback === 'function') {
          callback(status, headers, body);
        }
      }
    });
  },
  metadataRequest: function(parameters, callback) {
    // used for filters
    // year, director, writer, actor, genre, resolution, watched status, file count, container, duration
    var that = this;
    this.log('METADATA REQUEST');

    parameters.api = 'SYNO.VideoStation.Metadata';
    if (parameters.method === undefined) {
      parameters.method = 'list';
    }
    this.request(parameters, function(status, headers, body) {
      if (callback !== undefined) {
        if (typeof callback === 'function') {
          callback(status, headers, body);
        }
      }
    });
  },
  movieRequest: function(parameters, callback) {
    var that = this;
    this.log('MOVIE REQUEST');

    parameters.api = 'SYNO.VideoStation.Movie';
    // set parameters to empty if they are not defined in input variable
    if (parameters.method === undefined) {
      parameters.method = 'list';
    }
    // default parameters for list method
    if (parameters.method == 'list') {
      if (parameters.sort_by === undefined) {
        parameters.sort_by = 'title';
      }
      if (parameters.offset === undefined) {
        parameters.offset = '0';
      }
      if (parameters.limit === undefined) {
        parameters.limit = '1000';
      }
      if (parameters.sort_direction === undefined) {
        parameters.sort_direction = 'asc';
      }
      if (parameters.library_id === undefined) {
        parameters.library_id = '0';
      }
      if (parameters.actor === undefined) {
        parameters.actor = '[]';
      }
      if (parameters.director === undefined) {
        parameters.director = '[]';
      }
      if (parameters.writer === undefined) {
        parameters.writer = '[]';
      }
      if (parameters.genre === undefined) {
        parameters.genre = '[]';
      }
      if (parameters.year === undefined) {
        parameters.year = '[]';
      }
      if (parameters.date === undefined) {
        parameters.date = '[]';
      }
      if (parameters.channel_name === undefined) {
        parameters.channel_name = '[]';
      }
      if (parameters.title === undefined) {
        parameters.title = '[]';
      }
      if (parameters.resolution === undefined) {
        parameters.resolution = '[]';
      }
      if (parameters.watchedstatus === undefined) {
        parameters.watchedstatus = '[]';
      }
      if (parameters.filecount === undefined) {
        parameters.filecount = '[]';
      }
      if (parameters.container === undefined) {
        parameters.container = '[]';
      }
      if (parameters.duration === undefined) {
        parameters.duration = '[]';
      }
      if (parameters.additional === undefined) {
        parameters.additional = '["watched_ratio"]';
      }
      if (parameters.version === undefined) {
        parameters.version = '2';
      }
    }

    this.request(parameters, function(status, headers, body) {
      //that.parseMovieResponse(status, headers, body);
      if (callback !== undefined) {
        if (typeof callback === 'function') {
          callback(status, headers, body);
        }
      }
    });
  },
  deviceRequest: function(parameters, callback) {
    // used for list players, 
    var that = this;
    this.log('DEVICE REQUEST');

    parameters.api = 'SYNO.VideoController.Device';
    if (parameters.method === undefined) {
      parameters.method = 'list';
    }
    this.request(parameters, function(status, headers, body) {
      if (callback !== undefined) {
        if (typeof callback === 'function') {
          callback(status, headers, body);
        }
      }
    });
  },    
  playbackRequest: function(parameters, callback) {
    // used for control remote player
    var that = this;
    this.log('PLAYBACK REQUEST');

    parameters.api = 'SYNO.VideoController.Playback';
    if (parameters.method === undefined) {
      parameters.method = 'status';
    }
    if (parameters.version === undefined) {
      parameters.version = '2';
    }
    this.request(parameters, function(status, headers, body) {
      if (callback !== undefined) {
        if (typeof callback === 'function') {
          callback(status, headers, body);
        }
      }
    });
  },  
  volumeRequest: function(parameters, callback) {
    // used for control remote player
    var that = this;
    this.log('VOLUME REQUEST');

    parameters.api = 'SYNO.VideoController.Volume';
    if (parameters.method === undefined) {
      parameters.method = 'getvolume';
    }
    if (parameters.version === undefined) {
      parameters.version = '1';
    }
    this.request(parameters, function(status, headers, body) {
      if (callback !== undefined) {
        if (typeof callback === 'function') {
          callback(status, headers, body);
        }
      }
    });
  },
  subtitleRequest: function(parameters, callback) {
    // used for control remote player
    var that = this;
    this.log('SUBTITLE REQUEST');

    parameters.api = 'SYNO.VideoStation.Subtitle';
    if (parameters.method === undefined) {
      parameters.method = 'list';
    }
    if (parameters.version === undefined) {
      parameters.version = '2';
    }
    this.request(parameters, function(status, headers, body) {
      if (callback !== undefined) {
        if (typeof callback === 'function') {
          callback(status, headers, body);
        }
      }
    });
  },
  getRequestUrl: function(parameters, callback) {
    // get url for poster, don't use with other requests
    var that = this;
    this.log('GET REQUEST URL');
    var url = '/webapi/%path?';
    
    if (this.apiInfo !== undefined ) {
      if (this.apiInfo[parameters.api] !== undefined) {
        url = url.replace('%path', this.apiInfo[parameters.api].path);
      }
    } else {
      if (parameters.path !== undefined) {
        url = url.replace('%path', parameters.path);
      }
    }
    url += 'api=' + parameters.api;
    delete parameters.api;

    for (var key in parameters) {
      url += '&' + key + '=' + encodeURIComponent(parameters[key]);
    }
    url = this.protocol + '://' + this.ip + ':' + this.port + url;
    this.log('GET REQUEST URL:' + url);
    if (callback !== undefined) {
      if (typeof callback === 'function') {
        callback(url);
      }
    }
    return url;
  },
  request: function(parameters, callback) {
    // main request function.
    // unless audiostation js module I use here POST http requests
    var that = this;
    this.log('MAKE REQUEST');
    var url = '/webapi/%path';
    var requestMethod = 'POST';
    if (this.apiInfo !== undefined ) {
      if (this.apiInfo[parameters.api] !== undefined) {
        // check if this API exists and we have info about it
        // if we do then we get cgi path
        url = url.replace('%path', this.apiInfo[parameters.api].path);
      }
    } else {
      if (parameters.path !== undefined) {
        // if API doesn't exist perhaps because table of API info isn't created yet
        // so check path parameter in this case
        url = url.replace('%path', parameters.path);
      }
    }
    var headers = {
      'User-Agent' : 'iViewer/4',
    };
    // check if session id is created
    if (this.sid !== undefined) {
      parameters._sid = this.sid;
    }
    // we use parameters.path in case when we getting api info
    // so in other cases after parsing api info table with API names and paths is created
    // in any case we don't need path parameter in request body
    if (parameters.path !== undefined) {
      delete parameters.path;
    }
    url = this.protocol + '://' + this.ip + ':' + this.port + url;
    
    this.log(url);
    this.log(JSON.stringify(parameters));

    CF.request(url, requestMethod, headers, parameters, function(status, headers, body) {
      if (typeof callback === 'function') {
        callback(status, headers, body);
      }
    });
  },

  // --------------------------
  // - parse functions
  parseApiInfoResponse: function(status, headers, body) {
    this.log('PARSE API INFO RESPONSE');
    var info = JSON.parse(body);
    this.apiInfo = info.data;
  },
  parseLogin: function(status, headers, body) {
    this.log('PARSE LOGIN RESPONSE');
    if (status == 200) {
      var responseObj = JSON.parse(body);
      if (responseObj.data !== undefined) {
        if (responseObj.data.sid !== undefined) {
          this.sid = responseObj.data.sid;
        }
      }
    } else {
      this.log('Error:' + status);
    }
  },
  parseMovieDetails: function(status, headers, body) {
    var response = JSON.parse(body);
    if (response.data !== undefined) {
      if (response.data.movies !== undefined) {
        //clear old data
        CF.setJoin(this.movieDetails.titleJoin, '');
        CF.setJoin(this.movieDetails.dateJoin, '');
        CF.setJoin(this.movieDetails.taglineJoin, '');
        CF.setJoin(this.movieDetails.summaryJoin, '');

        CF.listRemove(this.movieDetails.actorList);
        CF.listRemove(this.movieDetails.genreList);
        CF.listRemove(this.movieDetails.directorList);
        CF.listRemove(this.movieDetails.writerList);

        if (response.data.movies[0].additional.actor !== undefined) {
          this.createListInDetails(response.data.movies[0].additional.actor, this.movieDetails.actorList);
        }
        if (response.data.movies[0].additional.director !== undefined) {
          this.createListInDetails(response.data.movies[0].additional.director, this.movieDetails.directorList);
        }
        if (response.data.movies[0].additional.genre !== undefined) {
          this.createListInDetails(response.data.movies[0].additional.genre, this.movieDetails.genreList);
        }
        if (response.data.movies[0].additional.writer !== undefined) {
          this.createListInDetails(response.data.movies[0].additional.writer, this.movieDetails.writerList);
        }
        if (response.data.movies[0].additional.files !== undefined) {
          this.log('files!!!');
          this.createFileList(response.data.movies[0].additional.files);
        }
        CF.setJoin(this.movieDetails.titleJoin, response.data.movies[0].title);
        CF.setJoin(this.movieDetails.dateJoin, response.data.movies[0].original_available);
        CF.setJoin(this.movieDetails.taglineJoin, response.data.movies[0].tagline);
        CF.setJoin(this.movieDetails.summaryJoin, response.data.movies[0].additional.summary);
      }
    }   
  },
  parseMovieList: function (status, headers, body) {
    var response = JSON.parse(body);
    if (response.data !== undefined) {
      if (response.data.movies !== undefined) {
        this.createMovieList(response.data.movies);
      }
    }
  },
  parseFolderList: function (status, headers, body) {
    var response = JSON.parse(body);
    if (response.data !== undefined) {
      if (response.data.objects !== undefined) {
        this.createFolderList(response.data.objects);
      }
    }
  },
  parsePluginSearchStart: function(status, headers, body) {
    var response = JSON.parse(body);
    if (response.data !== undefined) {
      this.pluginSearch.id = response.data.id;
    }
  },
  parsePluginSearchList: function(status, headers, body) {
    var response = JSON.parse(body);
    if (response.data !== undefined) {
      this.createPluginSearchResultList(response.data.results);
    }
  },
  parseMetadata: function(status, headers, body) {
    var response = JSON.parse(body);
    if (response.data !== undefined) {
      if (response.data.metadatas !== undefined) {
        this.createFilterList(response.data.metadatas);
      }
    }
  },
  parseDeviceList: function(status, headers, body) {
    var response = JSON.parse(body);
    if (response.data !== undefined) {
      if (response.data.devices !== undefined) {
        this.createDeviceList(response.data.devices);
      }
    }
  },
  parseSubtitleResponse: function(status, headers, body) {
    var response = JSON.parse(body);
    if (response.data !== undefined) {
      this.createSubtitleList(response.data);
    }
  },

  // ------------------------
  // create list functions
  createPluginSearchResultList: function(results) {
    var that = this;
    this.log('CREATE PLUGIN SEARCH RESULT LIST');
    CF.listRemove(this.pluginSearch.resultList);
    var tmpArr = [];
    for (var i = 0, imax = results.length; i < imax; i += 1) {

      var title = results[i].title;
      this.log(title);
      var summary = results[i].summary;
      var original_available = results[i].original_available;
      var id = results[i].id;

      var actor = results[i].actor;
      var director = results[i].director;
      var extra = results[i].extra;
      var genre = results[i].genre;
      var writer = results[i].writer;
      var tagline = results[i].tag_line;
      

      var tmpItem = {
        s1: title,
        s2: summary,
        s3: original_available,
        s4: id,
        s5: actor,
        s6: director,
        s7: extra, 
        s8: genre,
        s9: writer,
        s10: tagline,
        
      };
      tmpArr.push(tmpItem);
    }
    CF.listAdd(this.pluginSearch.resultList, tmpArr);
  },
  createListInDetails: function(object, listJoin) {
    var that = this;
    this.log('CREATE LIST IN MOVIE DETAILS');
    CF.listRemove(listJoin);
    var tmpArr = [];
    for (var i = 0, imax = object.length; i < imax; i += 1) {
      tmpArr.push({s1: object[i].name, s2: object[i].id});
    }
    CF.listAdd(listJoin, tmpArr);
  },
  createFileList: function(files) {
    var that = this;
    this.log('CREATE FILE LIST');
    var listArr = [];
    CF.listRemove(this.fileList);
    CF.listRemove(this.subtitleList);
    for (var i = 0, imax = files.length; i < imax; i += 1) {
      var title = files[i].path.substr(files[i].path.lastIndexOf('/') + 1) + ' [' + this.humanFileSize(files[i].filesize) + ']';
      listArr.push({s1: title, s2: files[i].id, s3: files[i].filesize});
    }
    CF.listAdd(this.fileList, listArr);
  },
  createDeviceList: function(devices) {
    var that = this;
    this.log('CREATE DEVICE LIST');
    var listArr = [];
    CF.listRemove(this.deviceList);
    for (var i = 0, imax = devices.length; i < imax; i += 1) {
      listArr.push({s1: devices[i].title, s2: devices[i].id, s3: devices[i].volume_adjustable});
    }
    CF.listAdd(this.deviceList, listArr);
  },
  createSubtitleList: function(subtitles) {
    var that = this;
    this.log('CREATE SUBTITLE LIST');
    var listArr = [];
    CF.listRemove(this.subtitleList);
    for (var i = 0, imax = subtitles.length; i < imax; i += 1) {
      listArr.push({s1: subtitles[i].title + ' - ' + subtitles[i].format, s2: subtitles[i].id});
    }
    CF.listAdd(this.subtitleList, listArr);
  },
  createMovieList: function (movies) {
    var that = this;
    this.log('CREATE MOVIE LIST');
    CF.listRemove(this.movieList.join);
    var listArr = [];
    var tmpItem = {};
    // creating grid list
    for (var i = 0, imax = movies.length; i < imax; i += this.movieList.rowSize) {
      for (var j =0, jmax = this.movieList.rowSize; j < jmax; j += 1) {
        if (movies[i + j] !== undefined) {
          tmpItem[this.movieList.titleJoins[j]] = movies[i + j].title;
          tmpItem[this.movieList.idJoins[j]] = movies[i + j].id;
          var posterParameters = {'api': 'SYNO.VideoStation.Poster',
                                  'method': 'getimage',
                                  'version': '1',
                                  'type': 'movie',
                                  'id': movies[i + j].id
                                };
          tmpItem[this.movieList.posterJoins[j]] = this.getRequestUrl(posterParameters);
          tmpItem[this.movieList.typeJoins[j]] = 'movie';
        }
      }
      listArr.push(tmpItem);
      tmpItem = {};
    }
    CF.listAdd(this.movieList.join, listArr);
  },
  createFolderList: function (objects) {
    var that = this;
    this.log('CREATE FOLDER LIST');
    CF.listRemove(this.movieList.join);
    var listArr = [];
    var tmpItem = {};
    // creating grid list
    for (var i = 0, imax = objects.length; i < imax; i += this.movieList.rowSize) {
      for (var j =0, jmax = this.movieList.rowSize; j < jmax; j += 1) {
        if (objects[i + j] !== undefined) {
          if (objects[i + j].type == 'folder') {
            tmpItem[this.movieList.titleJoins[j]] = objects[i + j].title;
            tmpItem[this.movieList.idJoins[j]] = objects[i + j].id;
            tmpItem[this.movieList.typeJoins[j]] = 'folder';
            tmpItem[this.movieList.posterJoins[j]] = 'folder.png';
          }
          if (objects[i + j].type == 'file') {
            if (objects[i + j].additional !== undefined) {
              tmpItem[this.movieList.titleJoins[j]] = objects[i + j].additional.metadata.title;
              tmpItem[this.movieList.idJoins[j]] = objects[i + j].additional.metadata.id;
              var posterParameters = {'api': 'SYNO.VideoStation.Poster',
                                      'method': 'getimage',
                                      'version': '1',
                                      'type': 'movie',
                                      'id': objects[i + j].additional.metadata.id
                                    };
              tmpItem[this.movieList.posterJoins[j]] = this.getRequestUrl(posterParameters);
              tmpItem[this.movieList.typeJoins[j]] = 'movie';
            }
          } 
        }
      }
      listArr.push(tmpItem);
      tmpItem = {};
    }
    this.log(JSON.stringify(listArr));
    CF.listAdd(this.movieList.join, listArr);
  },

  createCategoryList: function() {
    var that = this;
    var listArr = [];
    CF.listRemove(this.movieSearch.filterListJoin);
    for (var key in this.movieSearch.filters) {
      var value = JSON.stringify(this.movieSearch.filters[key].value);
      listArr.push({s1: this.movieSearch.filters[key].title, s2: value, s3: key, s4: 'category'});
    }
    CF.listAdd(this.movieSearch.filterListJoin, listArr);
    if (this.movieSearch.currentCategory !== undefined) {
      delete this.movieSearch.currentCategory;
    }
  },
  createFilterList: function(filters) {
    var listArr = [];
    CF.listRemove(this.movieSearch.filterListJoin);
    this.log(this.movieSearch.filters[this.movieSearch.currentCategory].value);
    for (var i = 0, imax = filters.length; i < imax; i += 1) {
      if (this.movieSearch.filters[this.movieSearch.currentCategory].value.indexOf(filters[i].toString()) > -1) {
        listArr.push({s1: filters[i], d1: 1, s4: 'filter'});
      } else {
        listArr.push({s1: filters[i], d1: 0, s4: 'filter'});
      }
    }
    CF.listAdd(this.movieSearch.filterListJoin, listArr);
  },

  // list select functions
  filterListClick: function(list, listIndex, join) {
    var that = this;
    CF.listContents(list, 0, 0, function(items) {
      var itemType = items[listIndex].s4.value;
      switch (itemType) {
        case 'category':
          var category = items[listIndex].s3.value;
          var parameters = { 'library_id': '0', 'type': 'movie', 'sort_direction': 'asc', 'method': 'list', 'version': '2'};
          for (var key in that.movieSearch.filters) {
            if (key !== category) {
              parameters[that.movieSearch.filters[key].parameter] = JSON.stringify(that.movieSearch.filters[key].value);
            } else {
              parameters.category = category;
              parameters.sort_by = category;
            }
          }
          parameters.filecount = '[]';
          parameters.resolution = '[]';
          parameters.watchedstatus = '[]';
          parameters.duration = '[]';

          that.log(JSON.stringify(parameters));
          CF.listUpdate(list, [{index: listIndex, d1: 1}]);
          that.metadataRequest(parameters, function(status, headers, body) {
            that.movieSearch.currentCategory = category;
            that.parseMetadata(status, headers, body);
          });
          break;
        case 'filter':
          var valueIndex = that.movieSearch.filters[that.movieSearch.currentCategory].value.indexOf(items[listIndex].s1.value);

          if (items[listIndex].d1.value == '0') {
            CF.listUpdate(list, [{index: listIndex, d1: 1}]);
            if (valueIndex == -1) {
              that.movieSearch.filters[that.movieSearch.currentCategory].value.push(items[listIndex].s1.value);
            }
          } else {

            CF.listUpdate(list, [{index: listIndex, d1: 0}]);
            if (valueIndex > -1) {
              that.log(valueIndex);
              //that.movieSearch.filters[that.movieSearch.currentCategory].value =
              that.movieSearch.filters[that.movieSearch.currentCategory].value.splice(valueIndex, 1);
            }
          }
          //that.log(JSON.stringify(that.movieSearch.filters));
          that.makeSearch();
          break;
        default:
          break;
      }
    });
  },
  movieListClick: function(list, listIndex, join) {
    var that = this;
    this.log('Movie List Click: ' + listIndex + ':' + join);
    // find what exactly cinema was clicked
    var columnIndex = this.movieList.buttonJoins[join];
    this.log('columnIndex: ' + columnIndex);
    
    CF.listContents(list, listIndex, 1, function(items) {
      that.log(JSON.stringify(items));
      if (items[0][that.movieList.idJoins[columnIndex]] !== undefined) {
        var itemId = items[0][that.movieList.idJoins[columnIndex]].value;
        that.log('Clicked item id:' + itemId);
        var itemType = items[0][that.movieList.typeJoins[columnIndex]].value;
        that.log('item type is ' + itemType);
        switch (itemType) {
          case 'movie':
            that.log('movie was clicked');
            var parameters = {
              'id': itemId, 
              'method': 'getinfo', 
              'additional' : 'extra, summary, files, actor, writer, director, genre, collection',
              'version': '1'
            };
            that.movieRequest(parameters, function(status, headers, body) {
              that.log(body);

              that.parseMovieDetails(status, headers, body);
              // and then open details popup
              selectPopup('d307');
              // save movie id to use in editor
              that.openedMovie = itemId;
              // set poster join
              var itemPoster = items[0][that.movieList.posterJoins[columnIndex]].value;
              CF.setJoin(that.movieDetails.posterJoin, itemPoster);
            });
            break;
          case 'folder':
            that.log('folder was clicked');
            that.folderRequest({'id': itemId}, function(status, headers, body) {
              that.parseFolderList(status, headers, body);
              // pushing folder id to browse history
              that.browseHistory.push(itemId);
            });
            break;
          default:
            break;
        }
      } else {
        that.log('Clicked empty space');
      }
    });
  },
  pluginSearchResultClick: function(list, listIndex, join) {
    var that = this;
    this.log('PLUGIN SEARCH RESULT LIST CLICK');
    CF.listContents(list, listIndex, 1, function(items) {

      // Clear all joins
      CF.setJoin(that.movieEdit.titleJoin, '');
      CF.setJoin(that.movieEdit.taglineJoin, '');
      CF.setJoin(that.movieEdit.actorJoin, '');
      CF.setJoin(that.movieEdit.genreJoin, '');
      CF.setJoin(that.movieEdit.directorJoin, '');
      CF.setJoin(that.movieEdit.writerJoin, '');
      CF.setJoin(that.movieEdit.summaryJoin, '');
      CF.setJoin(that.movieEdit.posterJoin, '');

      var title = items[0].s1.value;
      var summary = items[0].s2.value;
      var original_available = items[0].s3.value;
      var id = items[0].s4.value;
      var tagline = items[0].s10.value;
      // split actor, director, genre and writers arrays
      var actor = JSON.parse(items[0].s5.value).join(',');
      var director = JSON.parse(items[0].s6.value).join(',');
      var genre = JSON.parse(items[0].s8.value).join(',');
      var writer = JSON.parse(items[0].s9.value).join(',');
      
      // set input fields values
      CF.setJoin(that.movieEdit.titleJoin, title);
      CF.setJoin(that.movieEdit.taglineJoin, tagline);
      CF.setJoin(that.movieEdit.availableJoin, original_available);
      CF.setJoin(that.movieEdit.actorJoin, actor);
      CF.setJoin(that.movieEdit.genreJoin, genre);
      CF.setJoin(that.movieEdit.directorJoin, director);
      CF.setJoin(that.movieEdit.writerJoin, writer);
      CF.setJoin(that.movieEdit.summaryJoin, summary);

      selectPopup('d309');
      that.stopPluginSearch();

      var extra = JSON.parse(items[0].s7.value);
      // check if poster is available
      if (extra['com.synology.TheMovieDb'] !== undefined) {
        if (extra['com.synology.TheMovieDb']['poster'] !== undefined) {
          if (extra['com.synology.TheMovieDb']['poster'].length > 0) {
            var poster = extra['com.synology.TheMovieDb']['poster'][0];
            CF.setJoin(that.movieEdit.posterJoin, poster);
          }
        }
      }

    });
  },
  deviceListClick: function(list, listIndex, join) {
    var that = this;
    CF.listUpdate(list, [{index: CF.AllItems, d1: 0}]);
    CF.listContents(list, listIndex, 1, function(items){
      that.currentDeviceTitle = items[0].s1.value; //title
      that.currentDevice = items[0].s2.value; //id
      that.currentDeviceVolume = items[0].s3.value; //volume_adjustable
      CF.listUpdate(list, [{index: listIndex, d1: 1}]);
    });
  },
  fileListClick: function(list, listIndex, join) {
    var that = this;
    CF.listUpdate(list, [{index: CF.AllItems, d1: 0}]);
    CF.listContents(list, listIndex, 1, function(items){
      that.currentFile = items[0].s2.value; //id
      that.currentFileSize = items[0].s3.value;
      CF.listUpdate(list, [{index: listIndex, d1: 1}]);

      //get subtitles for current file
      var parameters = {'method': 'list', 'version': '2', 'id': that.currentFile};
      delete that.currentSubtitles;
      that.subtitleRequest(parameters, function(status, headers, body) {
        that.parseSubtitleResponse(status, headers, body);
      });
    });
  },
  subtitleListClick: function(list, listIndex, join) {
    var that = this;
    CF.listUpdate(list, [{index: CF.AllItems, d1: 0}]);
    CF.listContents(list, listIndex, 1, function(items){
      that.currentSubtitles = items[0].s2.value; //id
      CF.listUpdate(list, [{index: listIndex, d1: 1}]);
    });
  },
  // applyFilters: function() {
  //   var that = this;
  //   var parameters = { 'library_id': '0', 'sort_direction': 'asc', 'method': 'list'};
  //   for (var key in this.movieSearch.filters) {
  //     parameters[that.movieSearch.filters[key].parameter] = JSON.stringify(that.movieSearch.filters[key].value);
  //   }
  //   this.movieRequest(parameters, function(status, headers, body) {
  //     that.parseMovieList(status, headers, body);
  //   });
  // },

  // other
  makeSearch: function() {
    var that = this;
    CF.getJoin(this.movieSearch.inputJoin, function(join, value, tokens) {
      var parameters = { 'library_id': '0', 'sort_direction': 'asc', 'method': 'list'};
      if (value !== '') {
        parameters.keyword = value;
      }
      for (var key in that.movieSearch.filters) {
        parameters[that.movieSearch.filters[key].parameter] = JSON.stringify(that.movieSearch.filters[key].value);
      }
      that.movieRequest(parameters, function(status, headers, body) {
        that.parseMovieList(status, headers, body);
      });
    });
  },
  clearFilters: function() {
    for (var key in this.movieSearch.filters) {
      this.movieSearch.filters[key].value = [];
    }
    this.createCategoryList();
    this.makeSearch();

  },
  saveMovieDetails: function() {
    var that = this;
    
    this.log('SAVE MOVIE DETAILS');
    CF.getJoins(this.movieEdit.joinArray, function(joins) {
      var poster = joins[that.movieEdit.posterJoin].value;
      var title = joins[that.movieEdit.titleJoin].value;
      var tagline = joins[that.movieEdit.taglineJoin].value;
      var original_available = joins[that.movieEdit.availableJoin].value;
      // Actor1,Actor2 =>> Actor1|Actor2
      var genre = joins[that.movieEdit.genreJoin].value.replace(/,/g, '|');
      var actor = joins[that.movieEdit.actorJoin].value.replace(/,/g, '|');
      var director = joins[that.movieEdit.directorJoin].value.replace(/,/g, '|');
      var writer = joins[that.movieEdit.writerJoin].value.replace(/,/g, '|');

      var summary = joins[that.movieEdit.summaryJoin].value;
      var movieId = that.openedMovie;

      var parameters = {
        'method': 'edit',
        'version': '1',
        'title': title,
        'tagline': tagline,
        'original_available': original_available,
        'genre': genre,
        'actor': actor,
        'writer': writer,
        'director': director,
        'summary': summary,
        'poster': 'url',
        'url': poster,
        'id': movieId,
        'library_id': '0',
        'overwrite': 'skip',
        'metadata_locked': 'true',
      };
      //send request to change movie details
      that.movieRequest(parameters, function(status, headers, body){
        that.log(body);
        // and then set image request
        var parameters = {
          'method': 'setimage',
          'version': '1',
          'title': title,
          'tagline': tagline,
          'original_available': original_available,
          'genre': genre,
          'actor': actor,
          'writer': writer,
          'director': director,
          'summary': summary,
          'poster': 'url',
          'url': poster,
          'id': movieId,
          'type': 'movie',
          'metadata_locked': 'true',
        };
        that.posterRequest(parameters, function(status, headers, body){
          var parameters = {
            'id': movieId, 
            'method': 'getinfo', 
            'additional' : 'extra, summary, files, actor, writer, director, genre, collection',
            'version': '1'
          };
          // now we get info about updated movie and return to description page
          that.movieRequest(parameters, function(status, headers, body) {
            that.parseMovieDetails(status, headers, body);
            // and then open details popup
            selectPopup('d307');
            // save movie id to use in editor
            that.openedMovie = movieId;
            // set poster join
            var posterParameters = {'api': 'SYNO.VideoStation.Poster',
                                    'method': 'getimage',
                                    'version': '1',
                                    'type': 'movie',
                                    'id': movieId,
                                  };
            CF.setJoin(that.movieDetails.posterJoin, '');
            setTimeout( function () {CF.setJoin(that.movieDetails.posterJoin, that.getRequestUrl(posterParameters));}, 3000);
            CF.setJoin('d50',0);
          });
        });
      });

    });
  },
  listPluginSearch: function() {
    var that = this;
    this.log('LIST PLUGIN SEARCH');
    if (this.pluginSearch.id !== undefined) {
      this.pluginSearchRequest({'method': 'list', 'id': this.pluginSearch.id},
        function(status, headers, body) {
          that.parsePluginSearchList(status, headers, body);
        });
    }
  },
  startPluginSearch: function() {
    var that = this;
    this.log('START PLUGIN SEARCH');


    // check if search is not active now
    if (this.pluginSearch.id === undefined) {
      CF.getJoin(this.pluginSearch.inputJoin , function(join, value, tokens) {
        if (value !== '') {
          var parameters = { 'method': 'start', 
                             'title': value,
                             'preferlanguage': that.pluginSearch.preferlanguage,
                             'type': 'movie'
                           };
          that.pluginSearchRequest(parameters,
            function(status, headers, body) {
              that.parsePluginSearchStart(status, headers, body);
            });
        }
      });
    } else {
      // if search is active then stop search and start new    
      this.pluginSearchRequest({'method': 'stop', 'id': this.pluginSearch.id},
        function(status, headers, body) {
          // delete search identifier
          delete that.pluginSearch.id;
          // start search
          that.startPluginSearch();
        });  
    }
  },
  stopPluginSearch: function() {
    var that = this;
    this.log('STOP PLUGIN SEARCH');
    CF.setJoin('d51', 0);
    if (this.pluginSearch.id !== undefined) {      
      this.pluginSearchRequest({'method': 'stop', 'id': this.pluginSearch.id},
        function(status, headers, body) {
          // delete search identifier
          delete that.pluginSearch.id;
        });  
    }
  },
  makePlay: function() {
    var that = this;
    this.log('MAKE PLAY FUNCTION');
    if (this.currentDevice !== undefined && this.currentFile !== undefined) {
      var parameters = {'method': 'play', 'version' : '2', 'position': '0'};
      parameters.id = this.currentDevice;
      parameters.title = this.currentDeviceTitle;
      parameters.file_id = this.currentFile;

      //parameters.client_id = [this.currentFile, this.openedMovie, 'movie', this.currentFileSize].join('-');
      if (this.currentSubtitles !== undefined) {
        parameters.subtitle_id = this.currentSubtitles;
      }
      this.playbackRequest(parameters, function(status, headers, body) {
        that.log(body);
      });
    }
  },

  // ------------------------
  // other functions
  humanFileSize: function(size) {
    var i = Math.floor( Math.log(size) / Math.log(1024) );
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
  },
  log: function(text) {
    if (this.debug == 1) {
      CF.log('Synology VideoStation:' + text); 
    }
  },
};