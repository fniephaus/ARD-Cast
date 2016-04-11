var player;
var currentUrl = '';

$(function() {
  player = new CastPlayer();
  $.ajax({
    type: "GET",
    url: "https://ardata.fniephaus.com/tatort.php",
    dataType: "xml",
    success: function (xml) {
        // Parse the xml file and get data
        var xmlDoc = $.parseXML(xml),
            $xml = $(xmlDoc);
        $(xml).find('item').each(function() {
          var title = $(this).children('title').text();
          var link = $(this).children('link').text();
          $('#tatortList').append('<option value="' + getDocumentId(link) + '">' + title + '</option>');
        });
    }
  });
});

function getDocumentId(str) {
  var re = new RegExp('documentId=([0-9]*)&');
  var m = re.exec(str);
  if (m != null && m.length == 2) {
    return m[1];
  }
  return null;
}

function launchApp() {
  player.launchApp();
}

function startPlayback() {
  var documentId = $('#tatortList option:selected').val();
  if (documentId == "") {
    var value = $('#documentId').val();
    documentId = getDocumentId(value);
    if (documentId == null){
      documentId = value;
    }
  }

  if (player.session == null || isNaN(documentId)) {
    return;
  }

  $.getJSON( "https://ardata.fniephaus.com/request.php?documentId=" + documentId, function( data ) {
    var quality = parseInt($('#quality').val());
    var url = decodeURIComponent(data['_mediaArray'][1]['_mediaStreamArray'][quality]['_stream']);
    player.loadMedia(url, 'video/mp4');
    $('#player_now_playing').html(url.split(/[\\/]/).pop());
    $('#controls').show();
  });
}

function pause() {
  if (player.session != null) {
    player.pauseMedia();
  }
}

function resume() {
  if (player.session != null) {
    player.playMedia();
  }
}

function seek(is_forward) {
  if (player.session != null) {
    player.seekMedia(1, is_forward);
  }
}

function seekTo() { 
  if (player.session != null) {
    player.seekTo(parseInt($("#player_seek_range").val()));
  }
}

function stop() {
  var reply = confirm("This will stop playback on the TV. Are you sure?");
  if (reply == true) {
    player.stopApp();
    $('#controls').hide();
  }
}

function volumeDown() {
  if (player.session != null) {
      player.volumeControl(false, false);
  }
}

function volumeUp() {
  if (player.session != null) {
    player.volumeControl(true, false);
  }
}

function volumeMute() {
  if (player.session != null) {
    player.volumeControl(false, true);
  }
}
