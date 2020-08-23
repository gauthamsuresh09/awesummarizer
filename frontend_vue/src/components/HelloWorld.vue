<template>
  <v-app id="inspire"><!--
    <v-navigation-drawer
      v-model="drawerRight"
      app
      clipped
      right
    >
      <v-list dense>
        <v-list-item @click.stop="right = !right">
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Open Temporary Drawer</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-right
      color="white"
      light
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Timestamp</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon @click.stop="drawerRight = !drawerRight"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-list-item @click.stop="left = !left">
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Open Temporary Drawer</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer
      v-model="left"
      fixed
      temporary
    ></v-navigation-drawer>

-->
  <v-app-bar
    app
    clipped-right
    color="white"
    light
  >
    <v-toolbar-title>Timestamp Generation</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-app-bar>
    <v-main class="mx-auto">
    <template>
      <div>
        <v-file-input label="File input" v-on:change="handleFileUpload()"></v-file-input>
        <v-btn small color="primary" v-on:click="submitFile()">Upload</v-btn>
      </div>
    </template>
      <video id="vid1" class="azuremediaplayer amp-default-skin" autoplay controls width="640" height="400" poster="poster.jpg" data-setup='{"nativeControlsForTouch": false}' cea708CaptionsSettings= '{ enabled: true, srclang: "en", label: "CC"}'>
          <source v-bind:src="url" type="application/vnd.ms-sstr+xml" />
          <p class="amp-no-js">
              To view this video please enable JavaScript, and consider upgrading to a web browser that supports HTML5 video
          </p>
      </video>
      <template>
        <v-card>
          <v-tabs
            v-model="tab"
            background-color="primary"
            dark
          >
            <v-tab key="transcript">
            Transcript
            </v-tab>
            <v-tab key="summary">
            Summary with Timestamps
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card flat>
                <v-card-text>{{ transcript }}</v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card 
              v-for="item in summary"
              :key="item.timestamp"
              flat
              >
                <v-card-text>{{ item.timestamp }}: {{ item.text }}</v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </template>
    </v-main>

    <v-navigation-drawer
      v-model="right"
      fixed
      right
      temporary
    ></v-navigation-drawer>

    <v-footer
      app
      color="blue-grey"
      class="white--text"
    >
      <span>Vuetify</span>
      <v-spacer></v-spacer>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
  import axios from "axios";

        // var myOptions = {
        //     autoplay: true,
        //     controls: true,
        //     width: "640",
        //     height: "400",
        //     poster: ""
        // };
        // var myPlayer = amp("azuremediaplayer", myOptions);
        // myPlayer.src(
        //     [
        //         { src: "//ams-samplescdn.streaming.mediaservices.windows.net/11196e3d-2f40-4835-9a4d-fc52751b0323/TearsOfSteel_WAMEH264SmoothStreaming720p.ism/manifest", type: "application/vnd.ms-sstr+xml" }, 
        //     ],
        //     [
        //         { src: "//ams-samplescdn.streaming.mediaservices.windows.net/11196e3d-2f40-4835-9a4d-fc52751b0323/TOS-en.vtt", srclang: "en", kind: "subtitles", label: "english" },
        //         { src: "//ams-samplescdn.streaming.mediaservices.windows.net/11196e3d-2f40-4835-9a4d-fc52751b0323/TOS-es.vtt", srclang: "es", kind: "subtitles", label: "spanish" },
        //         { src: "//ams-samplescdn.streaming.mediaservices.windows.net/11196e3d-2f40-4835-9a4d-fc52751b0323/TOS-fr.vtt", srclang: "fr", kind: "subtitles", label: "french" },
        //         { src: "//ams-samplescdn.streaming.mediaservices.windows.net/11196e3d-2f40-4835-9a4d-fc52751b0323/TOS-it.vtt", srclang: "it", kind: "subtitles", label: "italian" }
        //     ]
        // );
    
  export default {
    props: {
      source: String,
      id: String
    },
    data: () => ({
      drawer: null,
      drawerRight: null,
      right: false,
      left: false,
      file: '',
      transcript: '',
      summary: [],
      url: "",
      tab: null,
      items: [
        { tab: 'Transcript', content: 'Tab 1 Content' },
        { tab: 'Summary with Timestamps', content: 'Tab 2 Content' },
      ],    
    }),

    methods: {
        handleFileUpload(){
          this.file = this.$refs.file.files[0];
        },

        submitFile(){
          console.log('uploading file...')
          axios //
          this.transcript = "some transcript";
          this.url = "http://amssamples.streaming.mediaservices.windows.net/622b189f-ec39-43f2-93a2-201ac4e31ce1/BigBuckBunny.ism/manifest";
          this.summary = [{ text: "aaaaaaaaaa", timestamp: 100 }, { text: "bbbbbb", timestamp: 200 }]
          // let formData = new FormData();
          // formData.append('video', this.file);
          // axios.post('http://localhost:3000/upload',
          //   formData,
          //   {
          //     headers: {
          //         'Content-Type': 'multipart/form-data'
          //     }
          //   }
          // ).then(function(res){
          //   console.log('SUCCESS!!');
          //   this.transcript = res.data['transcript'];
          //   this.summary = res.data['summary'];
          //   this.url = res.data['urls'][2];
          // })
          // .catch(function(){
          //   console.log('FAILURE!!');
          // });
          // function parseTimestamps(timestamps){
          //   var output = "";
          //   timestamps.forEach(pair =>
          //     output += pair['timestamp'] + ": " + pair['text'] + "\n"
          //   )
          //   return output
          // }
        }
    }
  }
</script>
