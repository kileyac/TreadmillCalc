/**
 * Copyright (c) 2016 kileyac@github

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * https://github.com/kileyac/TreadmillCalc
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
      message: '',
    };
  },
  mpmToMPH: function(data){
    this.setState({message:''});
    var raw = data.split(":");
    if(raw.length != 2){
      this.setState({message:'No good.'});
      return;
    }
    var min = parseFloat(raw[0]);
    var sec = parseFloat(raw[1])/60;
    return (60/(min+sec)).toFixed(1);
  },
  mphToMPM: function(data){
    var rawMins = 60 / data;
    var mins = Math.floor(rawMins);
    var secs = Math.floor((rawMins - mins)*60);
    var secPad = "";
    if(secs.toString().length <2){
      secPad += "0";
    }
    var time = mins.toString()+":"+secPad+secs.toString();
    return time;
  },
  onMphChange: function(){
    var data = parseFloat(this.state.mph);
    if(isNaN(data)){
      this.setState({message:'Not a valid MPH'});
      return;
    }
    this.setState({mpm:this.mphToMPM(data)});
  },
  onMPMChange: function(){
    var data = this.mpmToMPH(this.state.mpm);
    if(isNaN(data)){
      return;
    }
    this.setState({mph:data.toString()});
  },
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to TreadmillCalc.  Enter speed to find your pace!
        </Text>
        <TextInput style={styles.dataField}
         onChangeText={(text)=>this.setState({
           mph: text,
         })}
         onSubmitEditing={this.onMphChange}
         value={this.state.mph}
         />
         <TextInput style={styles.dataField}
         onChangeText={(text)=>this.setState({
           mpm: text,
         })}
         onSubmitEditing={this.onMPMChange}
         value={this.state.mpm}
         />
         <Text style={styles.error}>
          {this.state.message}
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
  error: {
    fontSize:20,
    textAlign: 'center',
    margin: 10,
    color: 'red',
  },
  dataField: {
    height: 40,
    textAlign: 'center',
    borderColor: 'gray',
    borderWidth: 1,
  },
});

AppRegistry.registerComponent('TreadmillCalc', () => TreadmillCalc);
