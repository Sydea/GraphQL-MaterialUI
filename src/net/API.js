import React,{useState,useEffect} from 'react';
import axios from 'axios';

export function getUser(){ 
  return new Promise((resolve, reject) => {
    doPostUser(resolve, reject);
  });
}

export function updateUser(element){   
  return new Promise((resolve, reject) => {    
    doPostUpdateUser(element, resolve, reject);
  });
}

export function newActivity(element){   
  return new Promise((resolve, reject) => {    
    doPostNewActivity(element, resolve, reject);
  });
}

function doPostUpdateUser(element: Object, resolve: Function, reject: Function) {
  axios.post('https://fakeql.com/graphql/b7b358f9d823a1e2eb97f3209ad2277a',  {query: "mutation {updateUser(input: {firstname: "+JSON.stringify(element.firstname)+", task: "+JSON.stringify(element.task)+", done:"+element.done+"}, id: "+element.id.toString()+") {id}}", variables: {}})
  .then(res => {
    handleResultCode(res, resolve, reject)
  })
  .catch(err => {
    handleRejection(err, reject)
  });
}


function doPostUser(resolve: Function, reject: Function) {
  axios.post('https://fakeql.com/graphql/b7b358f9d823a1e2eb97f3209ad2277a', {query: "{users{firstname task done id}}", variables: {}})
  .then(res => {
    handleResultCode(res, resolve, reject)
  })
  .catch(err => {
    handleRejection(err, reject)
  });
}

function doPostNewActivity(element: Object,resolve: Function, reject: Function) {
  axios.post('https://fakeql.com/graphql/b7b358f9d823a1e2eb97f3209ad2277a',  {query: "mutation {createUser(input: {firstname: "+JSON.stringify(element.firstname)+", task: "+JSON.stringify(element.task)+", done:"+element.done+"}) {id}}", variables: {}})
  .then(res => {
    handleResultCode(res, resolve, reject)
  })
  .catch(err => {
    handleRejection(err, reject)
  });
}

function handleRejection(err: Object, showAlert:boolean, reject: Function) {
  reject(err);
}

function handleResultCode(res: any, resolve: Function, reject: Function) {
  const data = res.data;
  if (data) {
      resolve(data);
  
  } else {
      reject(res);
  }
}

