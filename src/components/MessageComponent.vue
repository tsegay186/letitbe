<script setup>
import CombinationComponent from './CombinationComponent.vue';
defineProps({
    client:String,
    content:String
})
</script>
<template>
    <div>
        <div class="message">
            <div class="message-writer">
                <p>
                    {{client}}
                </p>
            </div>
            <div class="message-content">
                <p>
                    {{content}}
                </p>
            </div>
            <slot>
            </slot>
        </div>
    </div>
</template>
<style scoped>
.message {
    width: 100%;
    padding: 6px;
    border-radius: 4px;
    background-color: rgb(25, 109, 192);
    padding-bottom: 10px;
}
.message-writer, .message-content{
    width: 100%;
}
.message-writer {
    font-size: 17px;
    font-weight: 600;
}
.message-content {
    padding-left: 3px;
    font-size: 18px;
    padding-bottom: 10px;
}
p{
    margin: 0;
}
</style>