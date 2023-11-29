const express=require('express')
const app=express()
const cors = require('cors')
require('dotenv').config()
const {RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole} = require('agora-token')

const port =process.env.port || 5000
app.use(express.json());
app.use(cors());

const APP_ID = process.env.appId;
const APP_CERTIFICATE = process.env.appCertificate;

  
  const nocache = (_, resp, next) => {
    resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    resp.header('Expires', '-1');
    resp.header('Pragma', 'no-cache');
    next();
  }
  
  const ping = (req, resp) => {
    resp.send({message: 'pong'});
  }
  
  const generateRTCToken = (req, resp) => {
    // set response header
    resp.header('Access-Control-Allow-Origin', '*');
    // get channel name
    const channelName = req.params.channel;
    if (!channelName) {
      return resp.status(400).json({ 'error': 'channel is required' });
    }
    // get uid
    let uid = req.params.uid;
    if(!uid || uid === '') {
      return resp.status(400).json({ 'error': 'uid is required' });
    }
    // get role
    let role;
    if (req.params.role === 'publisher') {
      role = RtcRole.PUBLISHER;
    } else if (req.params.role === 'audience') {
      role = RtcRole.SUBSCRIBER
    } else {
      return resp.status(400).json({ 'error': 'role is incorrect' });
    }
    // get the expire time
    let expireTime = req.query.expiry;
    if (!expireTime || expireTime === '') {
      expireTime = 3600;
    } else {
      expireTime = parseInt(expireTime, 10);
    }
    // calculate privilege expire time
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;
    // build the token
    let token;
    if (req.params.tokentype === 'userAccount') {
      token = RtcTokenBuilder.buildTokenWithAccount(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
    } else if (req.params.tokentype === 'uid') {
      token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
    } else {
      return resp.status(400).json({ 'error': 'token type is invalid' });
    }
    // return the token
    return resp.json({ 'rtcToken': token });
  }
  
  const generateRTMToken = (req, resp) => {
    // set response header
    resp.header('Access-Control-Allow-Origin', '*');
  
    // get uid
    let uid = req.params.uid;
    if(!uid || uid === '') {
      return resp.status(400).json({ 'error': 'uid is required' });
    }
    // get role
    let role = 'uid';
     // get the expire time
    let expireTime = req.query.expiry;
    if (!expireTime || expireTime === '') {
      expireTime = 3600;
    } else {
      expireTime = parseInt(expireTime, 10);
    }
    // calculate privilege expire time
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;
    // build the token
    console.log(APP_ID, APP_CERTIFICATE, uid, role, privilegeExpireTime)
    const token = RtmTokenBuilder.buildToken(APP_ID, APP_CERTIFICATE, uid, role, privilegeExpireTime);
    // return the token
    return resp.json({ 'rtmToken': token });
  }
  
  const generateRTEToken = (req, resp) => {
    // set response header
    resp.header('Access-Control-Allow-Origin', '*');
    // get channel name
    const channelName = req.params.channel;
    if (!channelName) {
      return resp.status(400).json({ 'error': 'channel is required' });
    }
    // get uid
    let uid = req.params.uid;
    if(!uid || uid === '') {
      return resp.status(400).json({ 'error': 'uid is required' });
    }
    // get role
    let role;
    if (req.params.role === 'publisher') {
      role = RtcRole.PUBLISHER;
    } else if (req.params.role === 'audience') {
      role = RtcRole.SUBSCRIBER
    } else {
      return resp.status(400).json({ 'error': 'role is incorrect' });
    }
    // get the expire time
    let expireTime = req.query.expiry;
    if (!expireTime || expireTime === '') {
      expireTime = 3600;
    } else {
      expireTime = parseInt(expireTime, 10);
    }
    // calculate privilege expire time
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;
    // build the token
    const rtcToken = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
    const rtmToken = RtmTokenBuilder.buildToken(APP_ID, APP_CERTIFICATE, uid, role, privilegeExpireTime);
    // return the token
    return resp.json({ 'rtcToken': rtcToken, 'rtmToken': rtmToken });
  }
  
//   app.options('*', cors());
  app.get('/ping', nocache, ping)
  app.get('/rtc/:channel/:role/:tokentype/:uid', nocache , generateRTCToken);
  app.get('/rtm/:uid/', nocache , generateRTMToken);
  app.get('/rte/:channel/:role/:tokentype/:uid', nocache , generateRTEToken);

app.listen(port, ()=>{
    console.log(`server is running on ${port}`);
})
