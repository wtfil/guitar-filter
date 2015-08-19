var React = require('react');
var audio = require('./audio');

var App = React.createClass({
	getInitialState() {
		return {
			volume: 0,
			all: [],
			from: 0,
			to: 41200
		};
	},
	componentWillMount() {
		audio.on('process', arr => {
			this.setState({
				volume: getAverageVolume(arr),
				all: arr
			});
		});
	},
	play() {
		audio.load('/test1.mp3', function (err, buffer) {
			audio.play(buffer);
		});
	},

	changeFrequency(e) {
		this.setState({
			[e.target.name]: e.target.value
		}, () => {
			audio.filter(this.state.from, this.state.to);
		});
	},

	render() {
		var fr = [];
		var {all} = this.state;
    	for (var i = 0; i < all.length; i++) {
			fr.push(<div className="fr" style={{height:  all[i] + 'px'}}></div>)
    	}

		return <div>
			<div>
				<button className="btn btn-default" onClick={this.play}>Play</button>
				<input type="text" value={this.state.from} name="from" onChange={this.changeFrequency}/>
				<input type="text" value={this.state.to} name="to" onChange={this.changeFrequency}/>
			</div>

			<div className="volumes">
				<div className="average" style={{height: this.state.volume + 'px'}}></div>
				<div>{fr}</div>
			</div>
		</div>;
	}
});

function getAverageVolume(arr) {
    var values = 0;
    var average;
    var length = arr.length;
    for (var i = 0; i < length; i++) {
        values += arr[i];
    }
    average = values / length;
    return average;
}

React.render(<App/>, document.body);
