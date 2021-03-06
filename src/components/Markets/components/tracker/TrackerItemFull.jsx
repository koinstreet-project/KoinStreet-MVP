import React, { PureComponent, Fragment } from 'react';
import { Container, Card, CardTitle, CardBody, CardText, Row, Col } from 'reactstrap';
import { pickSvgUrl } from './../../icons.js';
import ChartWrapper from './../chart/ChartWrapper';
import { injectIntl, FormattedNumber, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import { API_URL_COINCAP, SYMBOL_EMPTY } from './../../constants.js';
import { ROUTE_HOME } from './../RootRoutes';
import Helmet from 'react-helmet';
import Loader from './../common/Loader/Loader';
import Exchange from './../Exchange';
import { ThemeConsumer } from './../theme/Theme';
import isNumber from 'lodash/isNumber';

class TrackerItemFull extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      item: null,
      loading: true
    }
  }

  componentDidMount() {
    const { id, history } = this.props;
    fetch(`${API_URL_COINCAP}/assets/${id}`)
      .then(resp => resp.json())
      .then(resp => {
        const { data } = resp;
        if (data && data.name) {
          return this.setState({ item: data, loading: false });
        } else {
          history.replace(ROUTE_HOME);
        }
      })
      .catch(function (error) {
        console.log('Request failed', error);
      });
  }

  render() {
    const { item, loading } = this.state;
    const { intl: { formatNumber } } = this.props;
    return (
      <Container className="full-item loader-wrapper py-sm-2" style={{minHeight: '500px'}}>
        {!loading && item ?
          <Fragment>
            <Helmet
              title={item.name} />

            <Row>
              <Col className="mr-3" xs={12} sm={3}>
                <img style={{width: '120px', marginTop: '15px'}} className="mb-3 logo-img md" src={pickSvgUrl(item.symbol)} alt={`Logo ${item.name}`} />
              </Col>
              <Col className="py-2">
                <h1 style={{marginTop: '20px'}}>{item.name}</h1>
                {/* <h3>
                  <FormattedNumber value={item.supply} />
                  &nbsp;
                  <small>
                    <FormattedMessage id="app.сirculating-btc-supply"
                      defaultMessage="Circulating BTC Supply" />
                  </small>
                </h3> */}
              </Col>
            </Row>

            <Row className="mb-5">
              <Col xs={12} sm={4} className="mb-2">
                <Card style={{width: '100%'}}>
                  <CardBody>
                    <CardTitle>
                      <FormattedMessage id="app.current-value"
                        defaultMessage="Current Value" />
                    </CardTitle>
                    <CardText>
                      <FormattedNumber value={item.priceUsd} />&nbsp;({formatNumber(item.changePercent24Hr / 100, { style: 'percent' })})
                    </CardText>
                  </CardBody>
                </Card>
              </Col>
              <Col xs={12} sm={4} className="mb-2">
                <Card style={{width: '100%'}}>
                  <CardBody>
                    <CardTitle>
                      <FormattedMessage id="app.market-cap"
                        defaultMessage="Market Cap" />
                    </CardTitle>
                    <CardText>
                      {isNumber(item.marketCapUsd) ? <FormattedNumber value={item.marketCapUsd} /> : SYMBOL_EMPTY}
                    </CardText>
                  </CardBody>
                </Card>
              </Col>
              <Col xs={12} sm={4} className="mb-2">
                <Card style={{width: '100%'}}>
                  <CardBody>
                    <CardTitle>
                      <FormattedMessage id="app.24htVoume"
                        defaultMessage="24hr Volume" />
                    </CardTitle>
                    <CardText>
                      {isNumber(item.volumeUsd24Hr) ? <FormattedNumber value={item.volumeUsd24Hr} /> : SYMBOL_EMPTY}
                    </CardText>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <ThemeConsumer>
              <ChartWrapper id={item.id} />
            </ThemeConsumer>

            <div className="text-right item-footer" style={{marginBottom: '30px'}}>
              <Exchange currency={item.symbol.toLowerCase()} type="primary" />
            </div>

          </Fragment>
          :
          <Loader />}
      </Container>
    )
  }
}

export default withRouter(injectIntl(TrackerItemFull));
