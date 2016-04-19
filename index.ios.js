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
var RegexTextInput = require('./RegexTextInput')

var {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  TextInput,
  ListView,
  View,
} = React;

var FIVEK = ["1", "2", "3", "3.1"];
var TENK = ["2", "4", "6", "6.1"];
var HALFM = ["4", "8", "12", "13.1"];
var FULLM = ["8", "16", "25", "26.2"];

var TreadmillCalc = React.createClass( {
  getInitialState: function(){
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      mph: '',
      mpm: '',
      message: '',
      dataSource: ds.cloneWithRows(this._genRows('',FIVEK)),
    };
  },
  _splitData: [{dist:"N/A",time:"N/A"}],

  componentWillMount: function(){
    this._splitData = [{}];
  },
  multiplyTimeString: function(timeStr,distance){
    if(timeStr.length == 0){
      return '-';
    }
    // taken from stackoverfloe: http://stackoverflow.com/a/29967277
    var a = timeStr.split(':'); // split it at the colons
    var distanceNum = parseFloat(distance);

    // minutes are worth 60 seconds.
    var seconds = (+a[0]) * 60 + (+a[1]);
    var newSeconds= Math.floor(distanceNum*seconds);

    // multiply by 1000 because Date() requires miliseconds
    var date = new Date(newSeconds * 1000);
    var hh = date.getUTCHours();
    var mm = date.getUTCMinutes();
    var ss = date.getSeconds();
    // If you were building a timestamp instead of a duration, you would uncomment the following line to get 12-hour (not 24) time
    // if (hh > 12) {hh = hh % 12;}
    // These lines ensure you have two-digits
    if (hh < 10) {hh = "0"+hh;}
    if (mm < 10) {mm = "0"+mm;}
    if (ss < 10) {ss = "0"+ss;}
    // This formats your string to HH:MM:SS
    return hh+":"+mm+":"+ss;
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
    var tmp = this.mphToMPM(data);
    this.setState({mpm:tmp,
    dataSource:this.state.dataSource.cloneWithRows(this._genRows(tmp,FIVEK))});
  },
  onMPMChange: function(){
    var data = this.mpmToMPH(this.state.mpm);
    if(isNaN(data)){
      return;
    }
    this.setState(
      {mph:data.toString(),
       dataSource:this.state.dataSource.cloneWithRows(this._genRows(this.state.mpm,FIVEK))}
      );
  },
  displayError: function(text){
    this.setState({message:text});
  },
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Convert speed to pace!
        </Text>
        <View style={styles.inputRow}>
        <RegexTextInput style={styles.dataField}
         onChangeText={(text)=>this.setState({
           mph: text,
         })}
         onValidInput={this.onMphChange}
         value={this.state.mph}
         placeholder='MPH'
         errorText='Invalid mph'
         regex='^\s*\d+\.\d\s*$'
         onInvalidInput={this.displayError}
         />
         <RegexTextInput style={styles.dataField}
         onChangeText={(text)=>this.setState({
           mpm: text,
         })}
         onValidInput={this.onMPMChange}
         value={this.state.mpm}
         placeholder='Minutes/Mile'
         errorText='Invalid m/m'
         regex='^\s*[1-5]?\d:[0-5][0-9]\s*$'
         onInvalidInput={this.displayError}
         />
         </View>
         <Text style={styles.error}>
          {this.state.message}
         </Text>
         <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          />
      </View>
    );
  },
  renderRow: function(rowData: string, sectionID: number, rowID: number) {
    return(
      <View style={styles.row}>
        <Text style={styles.rowText}>{rowData.dist}</Text>
        <Text style={styles.rowText}>{rowData.time}</Text>
      </View>
      );
  },
  _genRows: function(time, distances){
    this._splitData=[{}];
    for(var ii = 0; ii < distances.length; ii++){
      var display = this.multiplyTimeString(time,distances[ii]);
      var tmp = {dist: distances[ii], time: display};
      this._splitData.push(tmp);
    }
    return this._splitData;
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A6BCC',
    padding: 20
  },
  inputRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    textAlign: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: 'white',
    width: 140,
    height: 60,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#2A6BCC',
  },
  rowText: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'white',
  },
});

AppRegistry.registerComponent('TreadmillCalc', () => TreadmillCalc);
