<script setup>
import { computed } from 'vue'
// const numberIsDrawn = computed(() => drawnNumbers.includes(number))
const closed = computed(() => 'closed' == props.className)
const opened = computed(() => 'opened' == props.className)


const props = defineProps({
    allNumbers: Array,
    drawnNumbers: Array,
    columnName: Array,
    className: String
})

function isNumberDrawn(number) {
    return props.drawnNumbers.includes(number)
}
</script>
<template>
    <div class="containerCard">
        <div v-for="(columnNumbers, columnIndex) in allNumbers" :key="columnIndex">
            <div class="columnContainer">
                <div class="columnName" v-if="columnName && columnName.length">
                    {{ columnName[columnIndex] }}
                </div>
                <div class="columnNumbers">
                    <div class="columnNumber"
                        :class="{ numberDrawn: isNumberDrawn(number), closed: isNumberDrawn(number) && closed, opened: isNumberDrawn(number) && opened }"
                        v-for="(number, numberIndex) in columnNumbers" :key="numberIndex">
                        {{ number }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.containerCard {
    width: fit-content;
    display: flex;
    background-color: rgb(63, 63, 61);
    justify-content: space-between;
    border-radius: 4%;
}

.columnContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 10px;
}

.columnName {
    text-align: center;
    padding: 8px;
    width: 30px;
    height: 30px;
    font-size: x-large;
    border-radius: 2rem;

}

.columnNumbers {
    display: flex;
    flex-direction: column;
}

.columnNumber {
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    margin-bottom: 1rem;
    border-radius: 1rem;
    font-size: large;

}

.numberDrawn {
    background-color: rgb(6, 126, 86);
}

.closed {
    background-color: rgb(6, 126, 86);
}

.opened {
    background-color: #03e92a;
}

.clack {
    background-color: red;
}
</style>