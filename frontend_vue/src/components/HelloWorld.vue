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
      <v-toolbar-title>Timestamp</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          justify="center"
          align="center"
        >
          <v-col md="shrink">
                    <video id="vid1" class="azuremediaplayer amp-default-skin" autoplay controls width="640" height="400" poster="poster.jpg" data-setup='{"nativeControlsForTouch": false}'>
                      <source v-bind:src="getUrl()" type="application/vnd.ms-sstr+xml" />
                      <p class="amp-no-js">
                          To view this video please enable JavaScript, and consider upgrading to a web browser that supports HTML5 video
                      </p>
                    </video>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn
                  :href="Transcript"
                  raised
                  small
                  target="_blank"
                  v-on="on"
                >
                  <p>Transcript</p>
                </v-btn>
              </template>
              <span>Source</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-container>
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
    },
    data: () => ({
      vidsrc: null
      
    }),
    methods: {
      getUrl() {
        this.vidsrc =  "http://amssamples.streaming.mediaservices.windows.net/91492735-c523-432b-ba01-faba6c2206a2/AzureMediaServicesPromo.ism/manifest";
        return this.vidsrc;
      }
    }
  }
</script>
