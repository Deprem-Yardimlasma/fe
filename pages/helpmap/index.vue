<script setup>
const center = ref([40, 40])
const projection = ref('EPSG:4326')
const zoom = ref(5)
const rotation = ref(0)
import starIcon from './star.png'

const featureSelected = (test) => {
    console.log('test', test)
}

const markerGeos = [{
    latitude: 36.631909,
    longitude: 35.445559
}, {
    latitude: 37.243411,
    longitude: 35.513080
}, {
    latitude: 39.339547,
    longitude: 34.51052
}
]

</script>
<template>
    <client-only>
        <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height: 100vh">
            <ol-view
                ref="view"
                :center="center"
                :rotation="rotation"
                :zoom="zoom"
                :projection="projection"
            />

            <ol-tile-layer>
                <ol-source-osm />
            </ol-tile-layer>

            <ol-vector-layer :updateWhileAnimating="true" :updateWhileInteracting="true" title="STAR">
                <ol-source-vector ref="vectorsource">
                    <ol-animation-shake :duration="2000" :repeat="1">
                        <ol-feature v-for="geo in markerGeos" :key="geo" :properties="{'id':geo}">
                            <ol-geom-point :coordinates="[geo.longitude, geo.latitude]"></ol-geom-point>
                            <ol-style>
                                <ol-style-icon :src="starIcon" :scale="0.1"></ol-style-icon>
                            </ol-style>
                        </ol-feature>
                    </ol-animation-shake>
                </ol-source-vector>

            </ol-vector-layer>

            <ol-interaction-select @select="featureSelected" :condition="false">
            </ol-interaction-select>
        </ol-map>
    </client-only>
</template>
