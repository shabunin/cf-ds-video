
CF.userMain = function() {
  videoStation.init();
};

var selectPopup = function(join) {
  var joinArr = [ { join: 'd306', value: 0 },
                  { join: 'd307', value: 0 },
                  { join: 'd308', value: 0 },
                  { join: 'd309', value: 0 },
                  { join: 'd311', value: 0 },
                  { join: 'd312', value: 0 },
                  { join: 'd313', value: 0 }];
  CF.setJoins(joinArr);
  CF.setJoin(join, 1);
};

var selectCategory = function(join) {
  var joinArr = [ { join: 'd301', value: 0 },
                  { join: 'd302', value: 0 },
                  { join: 'd303', value: 0 },
                  { join: 'd304', value: 0 },
                  { join: 'd305', value: 0 },
                  { join: 'd310', value: 0 },];
  CF.setJoins(joinArr);
  CF.setJoin(join, 1);
};

var selectAll = function(join) {
  selectCategory(join);
  selectPopup('d306');
  videoStation.libraryRequest({'offset' : 0, 'limit': '1000'},
    function(status, headers, body) {
      videoStation.movieRequest({'offset' : 0, 'limit': '1000'}, function(status, headers, body) {
        videoStation.parseMovieList(status, headers, body);
        // clear current movie
        delete videoStation.openedMovie;
      });
    });
};

var selectFolder = function(join) {
  selectCategory(join);
  selectPopup('d306');
  var folderId = videoStation.browseHistory[videoStation.browseHistory.length - 1];
  videoStation.folderRequest({'id': folderId},
    function(status, headers, body) {
      videoStation.parseFolderList(status, headers, body);
      delete videoStation.openedMovie;
    });
};

var selectAdded = function(join) {
  selectCategory(join);
  selectPopup('d306');
  videoStation.libraryRequest({},
    function(status, headers, body) {
      videoStation.movieRequest({'sort_by': 'added', 'sort_direction': 'desc'},
        function(status, headers, body) {
          videoStation.parseMovieList(status, headers, body);
          delete videoStation.openedMovie;
        });
    });
};

var selectWatched = function(join) {
  selectCategory(join);
  selectPopup('d306');
  videoStation.libraryRequest({},
    function(status, headers, body) {
      videoStation.movieRequest({'sort_by': 'watched', 'sort_direction': 'desc'}, 
        function(status, headers, body) {
          videoStation.parseMovieList(status, headers, body);
          delete videoStation.openedMovie;
        });
    });
};

var selectReleased = function(join) {
  selectCategory(join);
  selectPopup('d306');
  videoStation.libraryRequest({},
    function(status, headers, body) {
      videoStation.movieRequest({'sort_by': 'date', 'sort_direction': 'desc'},
        function(status, headers, body) {
          videoStation.parseMovieList(status, headers, body);
          delete videoStation.openedMovie;
        });
    });
};

var selectSearch = function(join) {
  selectCategory(join);
  selectPopup('d311');
   // videoStation.libraryRequest({},
   //   function(status, headers, body) {
   //     videoStation.movieRequest({},
   //       function(status, headers, body) {
   //         videoStation.parseMovieList(status, headers, body);
   //         delete videoStation.openedMovie;
   //       });
   //   });
   videoStation.createCategoryList();
   videoStation.clearFilters();

};
var openPlayDialog = function() {
  videoStation.deviceRequest({'method': 'list', 'version': '1'},
    function(status, headers, body) {
      videoStation.log(body);
      videoStation.parseDeviceList(status, headers, body);
      selectPopup('d313');
      delete videoStation.currentDevice;
      delete videoStation.currentDeviceTitle;
      delete videoStation.currentFile;
      delete videoStation.currentSubtitle;
    });
};

var goBack = function() {
  var guiJoins = ['d301', 'd302', 'd303', 'd304', 'd305', 'd306', 'd307', 'd308', 'd309', 'd310', 'd311', 'd312', 'd313'];
  CF.getJoins(guiJoins, function(joins) {
    // if selected not folder view
    if (joins['d301'].value == '1' || joins['d303'].value == '1' || joins['d304'].value == '1' || joins['d305'].value == '1' ) {
      // if details page is open then go back to list 
      // else nothing to do 
      if (joins['d307'].value == '1') {
        selectPopup('d306');
        delete videoStation.openedMovie;
      }
    }
    // if selected folder view
    if (joins['d302'].value == '1') {
      // if details page is open then go back to list
      // else go to previous folder
      if (joins['d307'].value == '1') {
        selectPopup('d306');
      } else {
        if (videoStation.browseHistory.length > 1) {
          //if we ar not in root folder then make request to get list previous folder
          // -2 because last is current folder and previous folder is before last item
          var prevId = videoStation.browseHistory[videoStation.browseHistory.length - 2];
          videoStation.folderRequest({'id' : prevId}, function(status, headers, body) {
            videoStation.parseFolderList(status, headers, body);
            // if we get response then delete last item of browsing history
            videoStation.browseHistory.pop();
          });
        }      
      } 
    }
    // if selected search view
    if (joins['d310'].value == '1') {
      // if details page is open then go back to list 
      // else nothing to do 
      if (joins['d307'].value == '1') {
        selectPopup('d311');
        delete videoStation.openedMovie;
      }
    }
    // if opened play options popup
    if (joins['d313'].value == '1') {
      selectPopup('d307');
      
      delete videoStation.currentDevice;
      delete videoStation.currentDeviceTitle;
      delete videoStation.currentFile;
      delete videoStation.currentSubtitle;
    }
    // if now search movie details is opened then go back to movie details
    // !!! don't forget add request for stop searching
    if (joins['d308'].value == '1') {
      selectPopup('d307');
      videoStation.stopPluginSearch();
    }
    // check if movie detail editor is open
    if (joins['d309'].value == '1') {
      selectPopup('d308');
      videoStation.stopPluginSearch();

    }
  });
};

