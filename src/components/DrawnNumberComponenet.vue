<script setup>
defineProps({
  round:{
    type:Number
  },
  number:{
    type:Number
  }
})
</script>
<template>
    <div class="drawn-number-container">
        <div class="game-round-number">
         <span> round {{ round??0 }} </span>
        </div>
        <div class="current-drawn-number">
          {{ number??"" }}
        </div>
    </div>
</template>

<style scoped>
.drawn-number-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 90%;
    width: 100%;
    background-color: rgb(63, 63, 61);
    padding-top: 8px;
    border-radius: 4%;
    font-size: x-large;
}
</style>