import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'

//this fucks up styling
//import 'bootstrap/dist/css/bootstrap.min.css';
//import './components/portfolio/App.css';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			access_token: '',
			token_type: '',
			expires_in: '',
			refresh_token: '',
			created_at: '',
			error: ''
		}
	}
	render() {

		const { auth } = this.props;
		if (!auth.uid) return <Redirect to='/signin' />
		const urlParams = new URLSearchParams(window.location.search);
		const
			grant_type = 'authorization_code',
			client_id = 'e4ac2eb07157bde62fa7f0b91f69ec20fdb6fa1d852903aa754d763a6a0de22c',
			client_secret = '6b53d4d106c59002760dd3084c9c691e135549892b56e54115ea4fb05986a7b7',
			redirect_uri = 'http://localhost:3000/portfolio';


		if (urlParams.get('code') != null) {
			const myParam = urlParams.get('code');
			axios
				.post('https://api.coinbase.com/oauth/token', {
					"grant_type": `${grant_type}`,
					"code": `${myParam}`,
					"client_id": `${client_id}`,
					"client_secret": `${client_secret}`,
					"redirect_uri": `${redirect_uri}`
				})
				.then(res => {
					if (res) {
						axios.get('https://api.coinbase.com/v2/user', { headers: { Authorization: 'Bearer '+res.data.access_token } })
						.then(response => {
							console.log(response);
							var name = response.data.data.name;


							axios.get('https://api.coinbase.com/v2/accounts', { headers: { Authorization: 'Bearer '+res.data.access_token } })
							.then(response => {
								if(response)
								{
									console.log(response);
									var balance = response.data.data[0].balance.amount;
									document.getElementById("balance").innerHTML = "Hello "+name+" your balance is "+balance;
								}
							})

						})
						window.history.pushState({ page: "another" }, "another page", "example.html");

					}
				}).catch(e => {
					if (e) {
						console.log(e);
					}
				})
		}
		return (
			<div className="Coinbase">
				<header className="Coinbase-header">
					<div>
						<p>Access Token : {this.state.access_token}</p>
						<p>Token Type : {this.state.token_type}</p>
						<p>Expire In : {this.state.expires_in}</p>
						<p>Refresh Token : {this.state.refresh_token}</p>
						<p>Create At : {this.state.created_at}</p>
						<span id="balance"></span>
					</div>
					<button className="btn btn-primary" onClick={() => window.open('https://www.coinbase.com/oauth/authorize?client_id=e4ac2eb07157bde62fa7f0b91f69ec20fdb6fa1d852903aa754d763a6a0de22c&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fportfolio&response_type=code&scope=wallet:user:read,wallet:accounts:read')}>Send Request</button>


					</header>
								</div>

							);

						}
					}

					const mapStateToProps = (state) => {
					  // console.log(state);
					  return {
					    posts: state.firestore.ordered.posts,
					    auth: state.firebase.auth,
					    notifications: state.firestore.ordered.notifications
					  }
					}

					export default compose(
					  connect(mapStateToProps),
					)(App)