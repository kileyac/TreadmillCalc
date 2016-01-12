/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');

var {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  TextInput,
  View,
} = React;


var TreadmillCalc = React.createClass( {
  getInitialState: function(){
    return{
      mph: '6.0',
      mpm: '10:00',
    };
  },
  mphToMPM: function(data){
    var rawMins = 60 / data;
    var mins = Math.floor(rawMins);
    var secs = Math.floor((rawMins - mins)*60);
    var time = mins.toString()+":"+secs.toString();
    return time;
  },
  onMphChange: function(){
    var data = parseFloat(this.state.mph);
    if(isNaN(data)){
      return;
    }
    this.setState({mpm:this.mphToMPM(data)});
  },
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to TreadmillCalc.  Enter speed to find your pace!
        </Text>
        <TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1}}
         onChangeText={(text)=>this.setState({
           mph: text,
         })}
         onSubmitEditing={this.onMphChange}
         value={this.state.mph}
         />
         <Text style={styles.instructions}>
           {this.state.mpm}
         </Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('TreadmillCalc', () => TreadmillCalc);
