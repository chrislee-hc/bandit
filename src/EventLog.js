import React, { useEffect, useState, useRef } from "react";
import "./stylesheets/EventLog.css";

function EventLog(props) {
  let [events, setEventsHook] = useState([]);
  let bottomRef = useRef(null);

  useEffect(() => {
    const handleEvent = (event) => {
      setEventsHook([...events, eventToDiv(event, events.length)]);
    };
    const handleAllEvents = (newEvents) => {
      console.log("here");
      console.log(newEvents.length);
      console.log(newEvents);
      console.log(eventToDiv(newEvents[0], 1));
      console.log(newEvents.map(eventToDiv));
      setEventsHook(newEvents.map(eventToDiv));
      console.log(events);
    };
    props.socket.on("event", handleEvent);
    props.socket.on("allEvents", handleAllEvents);
    return () => {
      props.socket.off("event", handleEvent);
      props.socket.off("allEvents", handleAllEvents);
    };
  }, [props.socket, events]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  const eventToDiv = (event, idx) => {
    switch (event["eventType"]) {
      case "flip":
        return (
          <div className="event-text" key={idx}>
            <div className="user">{event["agent"]}</div>&nbsp;flipped a tile:{" "}
            {event["tile"].toUpperCase()}
          </div>
        );
      case "join":
        return (
          <div className="event-text" key={idx}>
            <div className="user">{event["agent"]}</div>&nbsp;joined the game
          </div>
        );
      case "disconnect":
        return (
          <div className="event-text" key={idx}>
            <div className="user">{event["agent"]}</div>&nbsp;disconnected
          </div>
        );
      case "word":
        if (event["steal"]) {
          return (
            <div className="event-text" key={idx}>
              <div className="user">{event["agent"]}</div>&nbsp;stole&nbsp;
              <div className="tile-word">{event["stealWord"]}</div>
              &nbsp;from&nbsp;<div className="user">{event["stealFrom"]}</div>
              &nbsp;to create&nbsp;
              <div className="tile-word">{event["word"]}</div>
            </div>
          );
        } else {
          return (
            <div className="event-text" key={idx}>
              <div className="user">{event["agent"]}</div>&nbsp;created&nbsp;
              <div className="tile-word">{event["word"]}</div>&nbsp;from the
              board
            </div>
          );
        }
      default:
        console.log("hi");
    }
  };

  return (
    <div className="event-log">
      <div className="event-log-title">Event Log</div>
      <div className="event-list">
        {events} <div ref={bottomRef}></div>
      </div>
    </div>
  );
}

export default EventLog;
