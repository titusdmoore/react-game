import React, { PureComponent } from "react";
import { AppRegistry, StyleSheet, StatusBar, View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { Finger } from "./src/renderers";
import Grid from "./src/map";
import AsyncStorage from '@react-native-community/async-storage';

const rounds = [1500, 1500, 1250, 1250, 1250, 1000, 1000, 1000, 1000, 750, 750, 750, 750, 750, 500]

export default class BestGameEver extends PureComponent {
  constructor() {
    super();
    this.entities = {
      1: { position: [10, 20], count: 2, lost: () => this.lost(1), score: () => this.score(1)}
    }

    this.state = {
      score: 0,
      lost: false,
      entities: {...this.entities},
      main_menu: true,
      round: 0,
      highScore: 0
    }

    this.grid = new Grid();
    this.buttonID = 1

    this.score = this.score.bind(this)
    this.lost = this.lost.bind(this)
    this.restart = this.restart.bind(this)
    this.addButton = this.addButton.bind(this)
    this.addEntitiesToGrid = this.addEntitiesToGrid.bind(this)

    this.addEntitiesToGrid()
  }

  componentDidMount() {
    try {
      AsyncStorage.getItem('@highScore').then(highScore => {
        if(highScore !== null) {
          this.setState({highScore: parseInt(highScore)})
        }
      })
    } catch(e) {
    }
  }

  score(buttonID) {
    const {entities, score} = this.state;

    delete entities[buttonID]

    this.addEntitiesToGrid(entities)

    this.setState({entities, score: score + 1})
  }

  lost() {
    clearTimeout(this.buttonInterval);

    if (this.state.score > this.state.highScore) {
      AsyncStorage.setItem('@highScore', JSON.stringify(this.state.score))
    }

    this.setState({entities: {}, lost: true})
  }

  restart() {
    var highScore = this.state.highScore;

    if (this.state.score > this.state.highScore) {
      highScore = this.state.score;
    }

    this.addEntitiesToGrid({...this.entities})

    this.setState({entities: {...this.entities}, lost: false, main_menu: false, score: 0, round: 0, highScore}, () => {
      this.buttonInterval = setTimeout(this.addButton, rounds[0])
    })
  }

  addEntitiesToGrid(entities = this.state.entities) {
    this.grid.clear()
    
    for (const [id, entity] of Object.entries(entities)) {
      this.grid.setAreaTaken(entity.position[0], entity.position[1], entity.count)
    }
  }

  addButton() {
    const availableSizes = [1, 2, 3, 4]
    const selectedSize = availableSizes[Math.floor(Math.random() * availableSizes.length)];
    const availableSpots = this.grid.findOpenArea(selectedSize);
    const selectedSpot = availableSpots[Math.floor(Math.random() * availableSpots.length)];

    if (selectedSpot) {
      const entities = {...this.state.entities};
      this.buttonID++;
      const buttonID = this.buttonID;
      entities[this.buttonID] = { position: selectedSpot, count: selectedSize, lost: () => this.lost(buttonID), score: () => this.score(buttonID)}

      this.addEntitiesToGrid(entities)
      this.setState({entities, round: this.state.round + 1})
    }

    const timeout = rounds[this.state.round] ? rounds[this.state.round] : rounds[rounds.length - 1]

    this.buttonInterval = setTimeout(this.addButton, timeout)
  }
 
  render() {
    if (this.state.main_menu) {
      return (
        <SafeAreaView style={styles.gameOverBody}>
          <StatusBar hidden={true} />

          <Text style={styles.gameOverText}>React Native Game</Text>

          <Text style={styles.score}>High Score: {this.state.highScore}</Text>

          <TouchableOpacity onPress={this.restart} style={styles.restartButton}>
            <Text style={styles.restartButtonText}>Start Game</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }

    if (this.state.lost) {
      return (
        <SafeAreaView style={styles.gameOverBody}>
          <StatusBar hidden={true} />

          <Text style={styles.gameOverText}>GAME OVER</Text>
          <Text style={styles.score}>Final Score: {this.state.score}</Text>
          <TouchableOpacity onPress={this.restart} style={styles.restartButton}>
            <Text style={styles.restartButtonText}>TRY AGAIN</Text>
          </TouchableOpacity>

          {this.state.score > this.state.highScore ? (
            <Text style={styles.score}>New High Score!</Text>
          ) : null}
        </SafeAreaView>
      );
    }

    const entities = []

    for (const [id, entity] of Object.entries(this.state.entities)) {
      entities.push(
        <Finger key={id} position={entity.position} count={entity.count} lost={entity.lost} score={entity.score} />
      );
    }

    return (
      <SafeAreaView style={styles.body}>
        <StatusBar hidden={true} />

        <TouchableOpacity style={styles.backgroundButton} onPress={this.lost}>
          <View style={styles.container}>
            {entities}
          </View>
          <View style={styles.footer}>
            <Text style={styles.score}>Score: {this.state.score}</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
 
const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'black'
  },
  backgroundButton: {
    flex: 1
  },
  container: {
    flex: 1,
  },
  footer: {
    padding: 10
  },
  score: {
    color: 'white',
    fontSize: 20
  },
  gameOverBody: {
    backgroundColor: 'black',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  gameOverText: {
    color: 'white',
    fontSize: 40,
    marginBottom: 10
  },
  restartButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'white',
    marginBottom: 20
  },
  restartButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18
  }
});