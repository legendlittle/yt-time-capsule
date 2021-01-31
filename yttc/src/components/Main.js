import React from 'react'
import Rocket from '../images/yt_rocket.png'
import Video from './Video'
import { Col, Row, Container } from 'react-bootstrap'
export default function Main() {
    return (
        <Container className='main'>

            <div className='title-border'>

                <h1 className='title'>
                    YT Time Capsule <img className='rocket' src={Rocket} alt='youtube by yogi pramana from the Noun Project' />
                </h1>
            </div>

            <br></br>
            <br></br>
            <Row className='video-container'>

                <Video></Video>
                <Video></Video>
                <Video></Video>
                <Video></Video>
                <Video></Video>

            </Row>
            <br></br>
            <Row className='video-container2'>

                <Video></Video>
                <Video></Video>
                <Video></Video>
                <Video></Video>
                <Video></Video>

            </Row>

        </Container>


    )
}


