import React, { Component } from 'react';
import {connect} from 'react-redux';
import './Calc.css';
import * as math from 'mathjs';


class Calc extends Component {
  constructor(props){
    super(props);
    this.state = {
      lastClick: 'not init'
    }
  }
  
  addToHist() {
    var d = new Date();
    var histDate = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    if ((typeof(this.state.lastClick) === 'number')||(this.state.lastClick === '% ')){
      var formula = this.formulaFromInput.value;
      var formulaResult = math.eval(formula);
      this.props.onAddFormula(histDate + ' ' + formula +' = '+ formulaResult);
      if((typeof(formulaResult) === 'number')&&(formulaResult !== Infinity)){
        this.formulaFromInput.value = formulaResult;
      } else {
        this.formulaFromInput.value = '';
      }
    } 
  }
  
  addNumbToInput = (val) => {
      this.setState({lastClick: val});
      this.formulaFromInput.value += val; 
  }
  
  addSimpleOperToInput = (val) => {
    if ((this.state.lastClick === 'not init')) {
      this.formulaFromInput.value += '0' + val;
      this.setState({lastClick: val});
    } else if (typeof(this.state.lastClick) !== typeof(val)) {
      this.setState({lastClick: val});
      this.formulaFromInput.value += val; 
    } else if ((typeof(this.state.lastClick) === typeof(val))&&(this.state.lastClick !== '.')){
      this.formulaFromInput.value = this.formulaFromInput.value.slice(0,- this.state.lastClick.length);
      this.formulaFromInput.value += val;
      this.setState({lastClick: val});
    }
  }
  
  addPointToInput = () => {
    if (typeof(this.state.lastClick) === 'number'){
      var str = this.formulaFromInput.value;
      str = str.split(' ').reverse();
      if (!(str[0].indexOf('.') > -1)) {
        this.setState({lastClick: '.'});
        this.formulaFromInput.value += '.'; 
      }
    }
  }
  
  addPercentToInput = () => {
    if (typeof(this.state.lastClick) === 'number'){
      var str = this.formulaFromInput.value; 
      var calcStr = '';
      str = str.split(' ');
      str.some(function(item,index,str){
        calcStr += item + ' '; //часть строки от которой рассчитывается процент
        return (index === (str.length-3))
      })
      var operator = str[str.length-2] //оператор перед процентами
      var number = str[str.length-1] //число процентов (последний элемент в строке из инпута)
      if (str.length > 2){
        this.formulaFromInput.value = '('+ calcStr.trim() +') '+ operator +' '+ math.abs((math.eval(calcStr)/100*math.abs(math.eval(number))));
      }
    }
  }
  
  addNegativeToInput = () => {
    if (typeof(this.state.lastClick) === 'number'){
      var str = this.formulaFromInput.value; 
      var calcStr = '';
      str = str.split(' ');
      var number = str[str.length-1] //последний элемент в строке из инпута
      if (str.length > 2){
        str.some(function(item,index,str){
          calcStr += item + ' '; //часть строки, которая остается нетронутой
          return (index === (str.length-2))
        })
      }
      if (!(number.indexOf('(-') > -1)) { //проверка наличия выражения '(-' в последнем элементе строки
        number = '(-'+number+')';
      } else {
        number = number.slice(2);
        number = number.slice(0,-1);
      }
      this.formulaFromInput.value = calcStr.trim() +' '+ number;
    }
  }
  
  clearInput = () => {
    this.setState({lastClick: 'not init'})
    this.formulaFromInput.value = ''; 
  }

  render() {
    return (
      <div className="Calc">
       <div id="calcContent">
          <input className="calcInput" ref={(input) => {this.formulaFromInput = input}} placeholder="0" disabled/>
          <button className="calcBtn" onClick={() => {this.clearInput()}}> AC </button>
          <button className="calcBtn" onClick={() => {this.addNegativeToInput()}}> 	&#177; </button>
          <button className="calcBtn" onClick={() => {this.addPercentToInput()}}> % </button>
          <button className="calcBtn calcBtn-operator" onClick={() => {this.addSimpleOperToInput(' / ')}}> 	&#247; </button>
          <button className="calcBtn" onClick={() => {this.addNumbToInput(1)}}> 1 </button>
          <button className="calcBtn" onClick={() => {this.addNumbToInput(2)}}> 2 </button>
          <button className="calcBtn" onClick={() => {this.addNumbToInput(3)}}> 3 </button>
          <button className="calcBtn calcBtn-operator" onClick={() => {this.addSimpleOperToInput(' * ')}}> &#215; </button>
          <button className="calcBtn" onClick={() => {this.addNumbToInput(4)}}> 4 </button>
          <button className="calcBtn" onClick={() => {this.addNumbToInput(5)}}> 5 </button>
          <button className="calcBtn" onClick={() => {this.addNumbToInput(6)}}> 6 </button>
          <button className="calcBtn calcBtn-operator" onClick={() => {this.addSimpleOperToInput(' - ')}}> - </button>
          <button className="calcBtn" onClick={() => {this.addNumbToInput(7)}}> 7 </button>
          <button className="calcBtn" onClick={() => {this.addNumbToInput(8)}}> 8 </button>
          <button className="calcBtn" onClick={() => {this.addNumbToInput(9)}}> 9 </button>
          <button className="calcBtn calcBtn-operator" onClick={() => {this.addSimpleOperToInput(' + ')}}> + </button>
          <button className="calcBtn calcBtn-zero" onClick={() => {this.addNumbToInput(0)}}> 0 </button>
          <button className="calcBtn" onClick={() => {this.addPointToInput()}}> . </button>
          <button className="calcBtn calcBtnResult calcBtn-operator" onClick={this.addToHist.bind(this)}> = </button>
          
        </div>
        <div id="calcHistory">
          <ul className="calcHistoryList">
            {this.props.testStore.map((formula, index) =>
              <li key={index}>{formula}</li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    testStore: state
  }),
  dispatch => ({
    onAddFormula: (formula) => {
      dispatch({type: 'ADD_FORMULA', payload: formula})
    }
  })
)(Calc);