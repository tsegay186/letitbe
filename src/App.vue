<script setup>

import { computed, onMounted, ref, watch } from "vue";

import generateMatrix, { pickRandomNumberFrom, allNumbersInDomain } from './helperFunctions/generateRandomMatrix.js'

import { io } from "socket.io-client";

import MessageComponent from "./components/MessageComponent.vue";
import AllNumbers from "./components/AllNumbers.vue";
import DrawnNumberCompenent from "./components/DrawnNumberComponenet.vue"
import CombinationComponent from "./components/CombinationComponent.vue"

const URL = "http://localhost:3000";
const socket = io(URL);
const winner = ref(undefined)
const mySocketId = ref(undefined)

const drawnNumber = ref(undefined)
const successMessage = ref(undefined)
const drawnNumbers = ref([])
const timeout = ref(undefined)
const myCombination = ref([])

const checkForWinning = computed(() => myCombination.value.length && myCombination.value.every((number) => drawnNumbers.value.includes(number)))

const allNumbers = computed(() => allNumbersInDomain(1, 80, 10))
const columnNames = computed(() => ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'])

const clientJoinedGame = ref(false)

const allMessages = ref([])
const gameIsOnPlaying = ref(false)

onMounted(() => {

  socket.on("connect", async () => {
    await setUpdDataForNewConnection()
    mySocketId.value = socket.id;
    allMessages.value.push({ clientSocketId: socket.id, message: 'You Are Connected With The Server.' })

  });

  socket.on("disconnected", async () => {
    await setUpdDataForNewConnection()
  })

  socket.on('wellcome', (welcomeMessage) => {
    successMessage.value = welcomeMessage
  })

  socket.on('game initiated', (client) => {
    addClientMessageToState(client)
  })
  socket.on('game is starting', (client) => {
    addClientMessageToState(client)
  })
  socket.on('game is on playing', (client) => {
    addClientMessageToState(client)
    clientJoinedGame.value = false

  })
  socket.on('time out', (client) => {
    addClientMessageToState(client)
  })

  socket.on('someone joined the game', (client) => {
    addClientMessageToState(client)
  })

  socket.on('someone left the game', (client) => {
    addClientMessageToState(client)
  })

  socket.on('game will start immediately after', (client) => {
    timeout.value = client.message
    addClientMessageToState(client)

  })

  socket.on('random number', (gameState) => {
    gameIsOnPlaying.value = true
    timeout.value = undefined
    winner.value = undefined
    drawnNumber.value = gameState.drawnNumber;
    drawnNumbers.value = gameState.drawnNumbers

    if (checkForWinning.value) {
      socket.emit('bingo', mySocketId.value)
    }
  })

  socket.on('game over', (client) => {
    gameIsOnPlaying.value = false
    addClientMessageToState(client)
    clientJoinedGame.value = false
  })

  socket.on('game out of bound', (client) => {
    gameIsOnPlaying.value = false
    addClientMessageToState(client)
  })
})

function addClientMessageToState(client) {
  const content = {
    clientSocketId: client.clientSocketId,
    message: client.message
  }
  if (client.winnerSocketId && client.winnerCombination) {
    content.winnerSocketId = client.winnerSocketId
    content.winnerCombination = client.winnerCombination
  }
  allMessages.value.push(content)
}

function updateCombination() {
  myCombination.value = pickRandomNumberFrom(generateMatrix(15, 5, 1, 15))

  if (socket.connected && clientJoinedGame.value) {
    socket.emit('update combination', { clientSocketId: socket.id, clientCombination: myCombination.value })

  }

}

function joinGame() {
  if (socket.id) {
    if (myCombination.value) {
      clientJoinedGame.value = true
      socket.emit('join game', socket.id, myCombination.value)
    } else {
      alert('you did not have a combination, please make a combination')
    }
  } else {
    alert('looks like your connection is either not initiated or lost. please be connected to the server')
  }
}

function leaveGame() {
  socket.emit('leave game', socket.id)
  clientJoinedGame.value = false

}

async function setUpdDataForNewConnection() {
  winner.value = undefined
  mySocketId.value = undefined
  drawnNumber.value = undefined
  successMessage.value = undefined
  drawnNumbers.value = []
  timeout.value = undefined
  allMessages.value = []
  clientJoinedGame.value = false
}


</script>

<template>
  <div class="container">
    <header>
      {{ successMessage }}
    </header>
    <main>
      <div class="main-content">
        <div class="user-area">
          <div class="actions-container">
            <div class="choose-your-combination">
              <button class="generate-combination" @click="updateCombination">
                Update My Combination
              </button>
            </div>
            <div>
              <div class="join-game" v-if="!clientJoinedGame">
                <button @click="joinGame" :disabled="gameIsOnPlaying">
                  Join The Game
                </button>
              </div>
              <div class="leave-game" v-if="clientJoinedGame">
                <button @click="leaveGame">
                  Leave The Game
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="display-area">

          <div class="combination-container">
            <div class="my-card">
              <span>My Card</span>
            </div>
            <div class="my-combination" @vue:mounted="updateCombination">
              <CombinationComponent :combination="myCombination" :drawn-numbers="drawnNumbers"
                :class-name="'flex-column'" />
            </div>
          </div>

          <div class="all-numbers" v-if="drawnNumbers">
            <div>
              <AllNumbers :all-numbers="allNumbers" :drawn-numbers="drawnNumbers" :column-name="columnNames" />
            </div>
          </div>

          <div class="drawn-ball">
            <div>
              <DrawnNumberCompenent :number="drawnNumber" />
            </div>
          </div>

          <div class="message-container">
            <div class="my-socket-id">
              {{ socket.id }}
            </div>
            <div class="all-messages">
              <div v-for="message in allMessages" :key="message.clientSocketId" style="margin-bottom: 8px;">
                <MessageComponent :client="message.clientSocketId" :content="message.message">
                  <CombinationComponent v-if="message.winnerSocketId && message.winnerCombination"
                    :combination="message.winnerCombination" :class-name="'flex-row'"
                    :card-owner="message.winnerSocketId" />
                </MessageComponent>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.container {
  height: 100%;
  color: black;
}

header {
  height: 6%;
}
.wellcome-message {
  text-overflow: center;
  align-self: center;
}
main {
  height: 80%;
}
.main-content {
  display: flex;
  height: 100%;
  justify-content: space-evenly;
}
.user-area {
  width: 10%;
  display: flex;
  flex-direction: column;
  border-bottom-left-radius: 6px;
  border-top-left-radius: 6px;
}
.actions-container {
  height: 20%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

button {
  height: 40px;
  width: 100%;
  border-style: none;
  border-radius: 6px;
  cursor: pointer;
}

.join-game>button {
  background-color: rgb(24, 150, 24);
}

.leave-game>button {
  background-color: rgb(199, 15, 15);
}

.display-area {
  width: 85%;
  display: flex;
  justify-content: space-around;
}

.combination-container {
  width: 30%;
  display: flex;

}

.my-card {
  height: 30px;
  padding-top: 8px;
  padding-bottom: 10px;
  font-size: x-large;
}

.my-combination {
  min-width: 80px;
}

.generate-combination {
  background-color: rgb(24, 150, 24);
}

.drawn-ball {
  width: 30%;
}

.user-area,
.combination-container,
.drawn-ball,
.all-numbers {
  background-color: rgb(63, 63, 61);
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  position: relative;
  min-height: 100%;
  text-align: center;
}

.message-container {
  width: 100%;
  padding: 20px;
  background-color: lightslategray;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  padding: 20px;
  position: relative;
}

.my-socket-id {
  font-size: x-large;
  position: fixed;
  align-self: center;
}

.all-messages {
  margin-top: 40px;
  margin-bottom: 10px;
  padding: 14px;
  overflow-y: scroll;
  opacity: 1;
  height: 100;
  flex: 1;
  background-color: aliceblue;
  border: 1px solid black;

}

.input-container {
  margin-top: 6px;
  align-self: flex-end;
  width: 100%;
  background-color: green;
}

input {
  height: 40px;
  width: 100%;
  border-style: none;
  border-radius: 8px;
}

footer {
  padding: 0;
}
</style>
