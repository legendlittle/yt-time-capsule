import React from 'react'
import { Col, Row } from 'react-bootstrap'
export default function Video() {
    return (
        <div className='video'>
            <Col>
                <Row>

                    <p className='video-title'> Video Title Here </p>
                </Row>

                <Row>

                    <img className='video-thumbnail' src='https://picsum.photos/200/300' />
                </Row>

                <Row>
                    <p className='video-author'> by XxaznJLiu123xX</p>

                </Row>

            </Col>
        </div>
    )
}
