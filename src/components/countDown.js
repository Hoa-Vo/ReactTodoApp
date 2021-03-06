/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';
import {
   MuiPickersUtilsProvider,
   KeyboardDatePicker,
} from '@material-ui/pickers';
import {
   Card,
   Tooltip,
   Button,
   TextField,
   withStyles,
   makeStyles,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import confetti from '../images/confetti.png';
import '../css/countdown.css';

let events = JSON.parse(localStorage.getItem('events'));

if (events === null) {
   const temp = [];
   localStorage.setItem('events', JSON.stringify(temp));
   events = [];
}

function Events(props) {
   let content;

   const color = props.darkMode ? '#2a2a2a' : '#f9f9f9';

   const textColor = props.darkMode ? 'white' : 'black';

   const useStyles = makeStyles({
      card: {
         margin: '10px 10px 10px 0px',
         padding: '20px',
         backgroundColor: color,
      },
      text: {
         color: textColor,
      },
   });

   const classes = useStyles();

   const startCountDown = () => {
      try {
         for (const event of props.allEvents) {
            let now = new Date();
            let eventDate = new Date(event.endDay);
            let currentTime = now.getTime();
            let eventTime = eventDate.getTime();
            let remainTime = eventTime - currentTime;
            let s = Math.floor(remainTime / 1000);
            let m = Math.floor(s / 60);
            let h = Math.floor(m / 60);
            let d = Math.floor(h / 24);
            h %= 24;
            m %= 60;
            s %= 60;
            h = h < 10 ? '0' + h : h;
            m = m < 10 ? '0' + m : m;
            s = s < 10 ? '0' + s : s;
            document.getElementById(
               `${event.name}-day`
            ).innerText = `${d} days`;
            document.getElementById(
               `${event.name}-hour`
            ).innerText = `${h} hours`;
            document.getElementById(
               `${event.name}-min`
            ).innerText = `${m} mins`;
            document.getElementById(
               `${event.name}-sec`
            ).innerText = `${s} seconds`;
         }
      } catch {}
   };

   const deleteEvent = (e, name) => {
      props.deleteEvent(name);
   };

   if (props.allEvents.length) {
      content = props.allEvents.map(event => (
         <Card className={classes.card}>
            <div>
               <div className="event-block">
                  <p className={`event-title ${classes.text}`}>{event.name}</p>
                  <Tooltip title="Delete event">
                     <DeleteIcon
                        className={classes.text}
                        id={event.name}
                        onClick={e => deleteEvent(e, event.name)}
                     ></DeleteIcon>
                  </Tooltip>
               </div>
               <span
                  className={`event-time ${classes.text}`}
                  id={`${event.name}-day`}
               ></span>
               <span className={classes.text}>:</span>
               <span
                  className={`event-time ${classes.text}`}
                  id={`${event.name}-hour`}
               ></span>
               <span className={classes.text}>:</span>
               <span
                  className={`event-time ${classes.text}`}
                  id={`${event.name}-min`}
               ></span>
               <span className={classes.text}>:</span>
               <span
                  className={`event-time ${classes.text}`}
                  id={`${event.name}-sec`}
               ></span>
            </div>
         </Card>
      ));
   } else {
      content = (
         <div className="empty-event-main">
            <img className="empty-event-img" src={confetti}></img>
            <p className={classes.text} id="notification">
               Seem like there are no event ?
            </p>
            <p className={classes.text} id="hints ">
               Add some event
            </p>
         </div>
      );
   }

   useEffect(() => {
      setInterval(startCountDown, 1000);
   });

   return <div>{content}</div>;
}
function CountDown(props) {
   const [selectedDate, setSelectedDate] = useState(new Date());

   const [allEvents, setAllEvents] = useState(events);

   const inputColor = props.darkMode ? 'white' : 'black';

   let CustomTextField;

   if (!props.darkMode) {
      CustomTextField = withStyles({
         root: {
            width: '500px',
            marginRight: '20px',
         },
      })(TextField);
   } else {
      CustomTextField = withStyles({
         root: {
            width: '500px',
            marginRight: '20px',
            '& label.Mui-focused': {
               color: 'white',
            },
            '& .MuiInput-underline:after': {
               borderBottomColor: 'white',
            },
            '& .MuiOutlinedInput-root': {
               color: 'white',
               '& fieldset': {
                  borderColor: 'white',
               },
               '&:hover fieldset': {
                  borderColor: 'white',
               },
               '&.Mui-focused fieldset': {
                  borderColor: 'white',
               },
            },
         },
      })(TextField);
   }

   const useStyles = makeStyles({
      input: {
         color: inputColor,
      },
      label: {
         color: inputColor,
      },
      text: {
         color: inputColor,
      },
      button: {
         width: '200px',
         marginTop: '40px',
      },
      picker: {
         width: '200px',
         marginBottom: '40px',
      },
      card: {
         margin: '20px 20px 20px 0px',
      },
   });

   const classes = useStyles();

   const handleDateChange = date => {
      setSelectedDate(date);
   };

   const addEvents = () => {
      const eventName = document.getElementById('event-name').value;
      const items = {
         name: eventName,
         endDay: selectedDate,
      };
      setAllEvents(allEvents => [...allEvents, items]);
   };

   const deleteEvent = name => {
      setAllEvents(
         allEvents.filter(function (el) {
            return el.name !== name;
         })
      );
   };

   useEffect(() => {
      localStorage.setItem('events', JSON.stringify(allEvents));
      events = JSON.parse(localStorage.getItem('events'));
   }, [allEvents]);

   return (
      <div className="row">
         <div className="col">
            <div className="main-countdown">
               <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <h4 className={classes.text}>Add Event</h4>
                  <KeyboardDatePicker
                     className={classes.picker}
                     disableToolbar
                     variant="inline"
                     margin="normal"
                     id="date-picker-inline"
                     format="dd/MM/yyyy"
                     value={selectedDate}
                     onChange={handleDateChange}
                     label="Choose end day"
                     InputLabelProps={{
                        className: classes.text,
                     }}
                     InputProps={{
                        className: classes.input,
                     }}
                     KeyboardButtonProps={{
                        'aria-label': 'change date',
                     }}
                  />
               </MuiPickersUtilsProvider>
               <CustomTextField
                  id="event-name"
                  variant="outlined"
                  label="Event name"
                  InputProps={{
                     className: classes.input,
                  }}
                  InputLabelProps={{
                     className: classes.label,
                  }}
               ></CustomTextField>
               <Button
                  className={classes.button}
                  onClick={addEvents}
                  variant="contained"
                  color="primary"
               >
                  START COUNT DOWN
               </Button>
            </div>
         </div>
         <div className="col">
            <h4 className={classes.text}>All Events</h4>
            <div>
               <Events
                  darkMode={props.darkMode}
                  deleteEvent={deleteEvent}
                  allEvents={allEvents}
               ></Events>
            </div>
         </div>
      </div>
   );
}
export default CountDown;
