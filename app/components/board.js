import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class Board extends Component {

  componentDidMount() {
    setTimeout(() => {
      var myCanvas = document.getElementById('draw');
      paper.setup(myCanvas);
      var tool = new paper.Tool();

      tool.minDistance = 10;

      // Each user has a unique session ID
      // We'll use this to keep track of paths
      var sessionId = socket.id;

      // Returns an object specifying a semi-random color
      function randomColor() {

        return '#00000'

      }

      // An object to keep track of each users paths
      // We'll use session ID's as keys
       var paths = {};

      // -----------
      // User Events
      // -----------
      // The user started a path
      tool.onMouseDown = function(event) {

        // // Create the new path
        var color = randomColor();
        startPath( event.point, color, sessionId );
        var data = {
          x: event.point.x,
          y:event.point.y,
          color: color
        }

        // Inform the backend
        emit("startPath", data);

      }

       tool.onMouseDrag = function(event) {

        continuePath( event.point, sessionId );
        var data = {
          x: event.point.x,
          y: event.point.y
        }

        // Inform the backend
        emit("continuePath", data);

      }

      // -----------------
      // Drawing functions
      // Use to draw multiple users paths
      // -----------------

      function startPath( point, color, sessionId ) {

        paths[sessionId] = new paper.Path();
        paths[sessionId].strokeColor = color;
        paths[sessionId].add(point);

      }

      function continuePath(point, sessionId) {

        paths[sessionId].add(point);
      }

      // -----------------
      // Emit
      // Use to inform the server of user events
      // -----------------


      function emit(eventName, data) {

        socket.emit(eventName, data, sessionId);

      }

      // -----------------
      // On
      // Draw other users paths
      // -----------------


      socket.on( 'startPath', function( data, sessionId ) {
        var point = {
          x: data.x,
          y: data.y};

        startPath(point, data.color, sessionId);

      })


      socket.on( 'continuePath', function( data, sessionId ) {
        continuePath( data, sessionId);
        paper.view.draw();

      })

      socket.on( 'clearMe', function() {
        paper.project.activeLayer.removeChildren();
        paper.view.draw();

      })

    }, 100);

  }

  explodeData = () => {
    socket.emit('clearBoard');
  }

  render() {
    return (
      <div className='container-fluid board'>
        <div className='boardStuff'>
          <canvas id='draw' data-paper-resize />
          <button className='btn btn-block' onClick={this.explodeData}>Clear</button>
        </div>
      </div>
    );
  }
}

export default (Board);
