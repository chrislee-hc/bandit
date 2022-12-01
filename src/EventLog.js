import React, { useEffect, useState, useRef } from "react";

import OptionsDropdown from "./OptionsDropdown";
import WordTiles from "./WordTiles";
import TextTile from "./TextTile";
import "./stylesheets/EventLog.css";

function EventLog(props) {
  let [events, setEvents] = useState([]);
  let [optionsSelectedSet, setOptionsSelectedSet] = useState(
    new Set(["flip", "join", "disconnect", "new_word", "steal"])
  );
  let bottomRef = useRef(null);

  useEffect(() => {
    const handleEvent = (event) => {
      setEvents((events) => [...events, event]);
    };
    const handleAllEvents = (events) => {
      setEvents(events);
    };
    props.socket.on("event", handleEvent);
    props.socket.on("allEvents", handleAllEvents);
    return () => {
      props.socket.off("event", handleEvent);
      props.socket.off("allEvents", handleAllEvents);
    };
  }, [props.socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [events, optionsSelectedSet]);

  const eventToDiv = (event, idx) => {
    if (event["agent"] === null) {
      return null;
    }
    switch (event["eventType"]) {
      case "flip":
        if (!optionsSelectedSet.has("flip")) {
          return null;
        }
        return (
          <div className="event-text" key={idx}>
            <div className="user">{event["agent"]}</div>&nbsp;flipped a tile:{" "}
            <TextTile letter={event["tile"]} />
          </div>
        );
      case "join":
        if (!optionsSelectedSet.has("join")) {
          return null;
        }
        return (
          <div className="event-text" key={idx}>
            <div className="user">{event["agent"]}</div>&nbsp;joined the game
          </div>
        );
      case "disconnect":
        if (!optionsSelectedSet.has("disconnect")) {
          return null;
        }
        return (
          <div className="event-text" key={idx}>
            <div className="user">{event["agent"]}</div>&nbsp;disconnected
          </div>
        );
      case "word":
        if (event["steal"]) {
          if (!optionsSelectedSet.has("steal")) {
            return null;
          }
          return (
            <div className="event-text" key={idx}>
              <div className="user">{event["agent"]}</div>&nbsp;stole&nbsp;
              <WordTiles word={event["stealWord"]} />
              &nbsp;from&nbsp;<div className="user">{event["stealFrom"]}</div>
              &nbsp;to create&nbsp;
              <WordTiles word={event["word"]} />
            </div>
          );
        } else {
          if (!optionsSelectedSet.has("new_word")) {
            return null;
          }
          return (
            <div className="event-text" key={idx}>
              <div className="user">{event["agent"]}</div>&nbsp;created&nbsp;
              <WordTiles word={event["word"]} />
              &nbsp;from the board
            </div>
          );
        }
      default:
        console.log("error");
    }
  };

  return (
    <div className="event-log">
      <div className="event-log-top-box">
        <div className="event-log-title">Event Log</div>
        <div className="event-log-dropdown">
          <OptionsDropdown
            optionsSelectedSet={optionsSelectedSet}
            setOptionsSelectedSet={setOptionsSelectedSet}
          />
        </div>
      </div>
      <div className="event-list">
        {events.map(eventToDiv)} <div ref={bottomRef}></div>
      </div>
    </div>
  );
}

export default EventLog;
