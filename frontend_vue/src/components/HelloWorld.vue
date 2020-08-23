<template>
  <v-app id="inspire"><v-app-bar
      app
      clipped-right
      color="white"
      light
    >
    <v-spacer></v-spacer>
      <v-toolbar-title>AweSummarizer</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <div style="padding: 150px 0px 100px 150px">
        <v-responsive
          class="d-flex align-center"
          height="100%"
          width="100%"
        >
          <v-row>
            <v-col cols="6">
          <div
            :class="$vuetify.breakpoint.smAndDown ? 'flex-column align-start' : 'align-center'"
            class="d-flex flex-wrap"
          >
          <h1 style="font-size: 110px; line-height: 100%">Find what you want in your lectures.</h1>
            <v-btn
              :ripple="false"
              class="pa-1"
              tile
              x-large
              width = "150px"
              color="rgb(247, 178, 173)"
            >
              Get Started
            </v-btn>

          </div>
            </v-col>
            <v-col>
              <v-img
                :max-height="maxHeight"
                :max-width="maxWidth"
                :src="require('@/assets/home_computer.svg')"
                class="black--text"
                contain="true"

              ></v-img>
            </v-col>
          </v-row>
        </v-responsive>
      </div>
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
      <v-spacer></v-spacer>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
    </section>
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
      vidsrc: null,
      maxHeight: 500,
      maxWidth: 500
    }),
    methods: {
      getUrl() {
        this.vidsrc =  "http://amssamples.streaming.mediaservices.windows.net/91492735-c523-432b-ba01-faba6c2206a2/AzureMediaServicesPromo.ism/manifest";
        return this.vidsrc;
      }
    }
  }
</script>
