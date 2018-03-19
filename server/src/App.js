import React, { Component } from 'react';
import '../node_modules/materialize-css/dist/css/materialize.css';
import Materialize from '../node_modules/materialize-css/dist/js/materialize.js';
import './App.css';

import FlipMove from 'react-flip-move';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      click_count: 0,
      action_list : [],
      rendered_list : [],
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(e){
    // delete the particular item in the list;
    console.log("I am inside handleOnChange")
    let id = parseInt(e.target.id.substring(1),10);
   
 
    let rendered_list = this.state.rendered_list.slice();

    
    console.log(id);
    let json_id = rendered_list[id].id;
    rendered_list[id] = null;
    console.log(rendered_list);
    Materialize.toast('Yeah! You Have Completed One Item', 3000) ;
    this.setState({rendered_list: rendered_list});
   

   // make simultaneously changes to the json-server api
  var url = `http://localhost:3000/action_list/${json_id}`;
 

  fetch(url, {
    method: 'DELETE', 
    
  }).then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(response => console.log('Success:', response));
}
  
  handleClick(){
    let click_count  = this.state.click_count;
    let rendered_list = this.state.rendered_list.slice();
    console.log(rendered_list);
    let action_list = this.state.action_list.slice();
    for(let i = (click_count+1)*10; i< (click_count + 2)*10 && i < action_list.length; i++ ){
      rendered_list.push(action_list[i]);
    }
    console.log("List After modification");
    console.log(rendered_list);
     
    this.setState({click_count: (click_count + 1), rendered_list : rendered_list});
  }
  componentWillMount(){
   let x = fetch("http://localhost:3000/action_list");
    x.then(result => {
      return result.json();
    }).then(result => {
     
     let rendered_list = [];
     let action_list = result;

    if(this.state.click_count === 0){
      // push the initial content to the action list;
      
     
      for(let i=0; i<10 && i< action_list.length ; i++){
        rendered_list.push(action_list[i]);
      }
      this.setState({rendered_list: rendered_list, action_list: action_list});
    }
    });
   
  }
  render() {
  
    let rendered_list = this.state.rendered_list;
    console.log(rendered_list.length);
    const items = rendered_list.map((item,key) => {
      const id = `i${key}`;
     
     
      if(item == null){
        return;
      }
      
     
      return (

           <li key = {id} className= "collection-item row valign-wrapper" style={{padding: "0px"}}>
          

            <div className = "col s2">              
              <input type="checkbox" className="filled-in" id={id} onChange = {this.handleOnChange} />
              <label htmlFor={id} ></label>
              
            </div>
            <div className = "col s10">
                
                    <h5>{item.task}</h5>
                    <p><i><b>Deadline: </b>{item.deadline}</i></p>
                
            </div>

          </li>
        )
    });
    return (
      <div className="App container">
        <h2>Your Action List</h2>
        <ul className = "collection">
          <FlipMove duration={500} easing="ease-out" delay ={200}>
          {items}
          </FlipMove>
        </ul>
        <a className="waves-effect waves-light btn" onClick = {this.handleClick} >More Items</a>
      </div>
    );
  }
}

export default App;
