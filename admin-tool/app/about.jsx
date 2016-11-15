import React from 'react';
import { Carousel, Row, Col } from 'react-bootstrap';


export default class About extends React.Component {
  render() {
    return (
    <div>
        <Row>
            <h1><center>Welcome to Effective Travel app!</center></h1>
            <h3><center>hot girls</center></h3>
        </Row>

        <Row>
            <Col sm={8} smOffset={2}>
                <Carousel>
                    <Carousel.Item>
                        <img width={900} height={500} alt="900x500" src="https://pp.vk.me/c425325/v425325006/4c5b/_s_0CtAMdXI.jpg"/>
                        <Carousel.Caption>
                            <h3>Больше сисек</h3>
                            <p>Богу сисек</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img width={900} height={500} alt="900x500" src="https://pp.vk.me/c616731/v616731543/16cec/pR_kiGm3cF4.jpg"/>
                        <Carousel.Caption>
                            <h3></h3>
                            <p></p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </Col>
        </Row>
    </div>
    );
  }
}