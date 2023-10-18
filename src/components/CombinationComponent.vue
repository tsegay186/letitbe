<script setup>

const props = defineProps({
  combination: Array,
  drawnNumbers:{
    type:Array,
    default:[]
  },
  className: String,
  cardOwner:String
})

function isNumberDrawn(number) {
  return props.drawnNumbers.includes(number)
}
</script>
<template>
  <div class="container">
    <div class="winner-socket-id" v-if="className == 'flex-row'">
      {{cardOwner}}
    </div>
    <div :class="className">
      <div v-for="number in combination" :key="number">
        <div class="number" :class="{ numberDrawn: isNumberDrawn(number) }" style="min-width: 40px;">
          {{ number }}
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  padding: 10px;
  background-color: rgb(146, 146, 55);
  border-radius: 5px;
}

.winner-socket-id {
  font-style: italic;
}

.flex-column,
.flex-row {
  align-self: center;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.flex-column {
  min-height: 190px;
  flex-direction: column;
  padding: 20px 0 20px 0;
}

.flex-row {
  min-height: 50px;
}

.number {
  height: 30px;
  line-height: 30px;
  vertical-align: center;
  border-radius: 5px;
}

.numberDrawn {
  background-color: rgb(6, 252, 170);
}</style>