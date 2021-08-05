# Building
1) `npm install` to install all of the required packages
2) `nodemon` should start up the web server
3) Start up the ROS bridge server
4) Visit `ip:8080` for the website


# Notes
Currently this uses actions rather than just publishing directly to a topic so I need to do that.

## Todo

### Web Design
- [X] Make mockup sliders
- [ ] Find / make better more optimised sliders for touch screen
- [X] Add optional buttons
- [ ] Style optional buttons
- [X] Add angle readouts
- [X] Make target angle writable?
- [ ] Add animated readout
- [ ] Screen size updates model render
- [ ] Make everything offline
- [X] Add toast for info
- [X] Toggle
- [X] Max min vals buttons
- [X] Table of depth distance lat long heading etc
- [ ] Pretty table of values
- [ ] Auto reconnect


### ROS Integration
- [X] Have target pitch adjust current pitch
- [ ] Connect sliders to publish to topic (not using goals to update)
- [ ] Perhaps make all sliders synced up? (If refresh page, will want to keep current?)
- [X] Connect up angle readouts to ROS
- [ ] Allow only one target / updates with new target?
- [X] Have param for max pitch and yaw
- [X] Add infrastructure for listeners
- [X] ROs paramaters with min max
- [ ] Change everything to just publish to ros topic
- [ ] Fix enable button