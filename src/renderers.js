import React, { PureComponent } from "react";
import { StyleSheet, TouchableOpacity, Text, Easing } from "react-native";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Animatable from 'react-native-animatable';
 
class Finger extends PureComponent {
  constructor(props) {
    super(props);

    this.buttonPress = this.buttonPress.bind(this)
    this.timer = null;

    this.state = {
      count: props.count,
    }
  }

  buttonPress() {
    const count = this.state.count;

    if (count > 1) {
      this.setState({count: count - 1})
    } else {
      this.props.score()
    }
  }

  componentDidMount() {
    const count = this.props.count;
    const time = (1500 + count * 1500);

    this.circularProgress.animate(100, time, Easing.linear);

    this.timer = setTimeout(() => {
      this.props.lost()
    }, time)
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  render() {
    const count = this.state.count;
    const radius = 20 + count * 20;
    const x = this.props.position[0] * 20 - radius;
    const y = this.props.position[1] * 20 - radius;

    return (
      <TouchableOpacity onPress={this.buttonPress}
        style={[styles.button, { left: x, top: y, borderRadius: radius * 2, width: radius * 2, height: radius * 2 }]} 
      >
        <Animatable.View  
          animation="pulse" 
          easing="linear" 
          duration={500} 
          iterationCount={1}
          style={[styles.buttonBackground, {borderRadius: radius * 2, width: (radius * 2 - 40), height: (radius * 2 - 40) }]} 
        >
          <Text style={styles.text}>{count}</Text>
          <AnimatedCircularProgress
            ref={(ref) => this.circularProgress = ref}
            size={(radius * 2)}
            width={5}
            fill={100}
            style={styles.border}
            tintColor="gray"
            onAnimationComplete={this.animationComplete}
            backgroundColor="white" 
          />
        </Animatable.View>
      </TouchableOpacity>
    );
  }
}
 
const styles = StyleSheet.create({
  button: {
    position: 'absolute',
  },
  buttonBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00FF00'
  },
  text: {
    color: 'black',
    fontWeight: '700',
    fontSize: 30
  },
  border: {
    position: 'absolute'
  }
});
 
export { Finger };