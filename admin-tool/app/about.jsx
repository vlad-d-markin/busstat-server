import React from 'react';
import { Carousel, Row, Col } from 'react-bootstrap';


export default class About extends React.Component {
  render() {
    return (
    <div>
        <Row>
            <h1><center>Welcome to Effective Travel app!</center></h1>
            <h3><center>friday girls</center></h3>
        </Row>

        <Row>
            <Col sm={8} smOffset={2}>
                <Carousel>
                    <Carousel.Item>
                        <img width={900} height={500} alt="900x500" src="https://pp.vk.me/c636222/v636222928/3a58f/g9LyoVn7xN4.jpg"/>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img width={900} height={500} alt="900x500" src="https://pp.vk.me/c636222/v636222928/39e6e/kDatTMNc_eI.jpg"/>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img width={900} height={500} alt="900x500" src="https://pp.vk.me/c316618/v316618193/7a34/DH6bK8TNhmM.jpg"/>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img width={900} height={500} alt="900x500" src="https://pp.vk.me/c413030/v413030219/70c9/Lahlj4uJOrk.jpg"/>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img width={900} height={500} alt="900x500" src="https://pp.vk.me/c316618/v316618371/a635/5BwmhMRUinY.jpg"/>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img width={900} height={500} alt="900x500" src="https://pp.vk.me/c425325/v425325934/4359/WgvgZx89t1A.jpg"/>
                    </Carousel.Item>
                </Carousel>
            </Col>
        </Row>
    </div>
    );
  }
}