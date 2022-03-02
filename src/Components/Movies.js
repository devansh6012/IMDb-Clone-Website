import React, { Component } from 'react'
// import { movies } from './getMovies'
import axios from 'axios';

export default class Movies extends Component {
    constructor(){
        super();
        this.state={
            hover:'',
            parr:[1],
            currPage:1,
            movies:[],
            favourites:[]
        }
    }
    async componentDidMount(){
        // Side Effects
        const res = await axios.get(`https://api.themoviedb.org/3/trending/all/day?api_key=a16cf5e2890517a8795ae140aa296ecb&language=en-US&page=${this.state.currPage}`);
        let data = res.data
        // console.log(data);
        this.setState({
            movies:[...data.results]
        })
        // console.log('mounting done');
    }
    changeMovies=async()=>{
        const res = await axios.get(`https://api.themoviedb.org/3/trending/all/day?api_key=a16cf5e2890517a8795ae140aa296ecb&language=en-US&page=${this.state.currPage}`);
        let data = res.data
        // console.log(data);
        this.setState({
            movies:[...data.results]
        })
    }
    handleRight=()=>{
        let temparr = []
        for(let i = 1; i <= this.state.parr.length + 1; i++){
            temparr.push(i);
        }

        // after doing the job execute changeMovies
        this.setState({
            parr:[...temparr],
            currPage:this.state.currPage+1
        },this.changeMovies)
    }
    handleLeft=()=>{
        if(this.currPage!=1){
            this.setState({
                currPage:this.state.currPage-1
            },this.changeMovies)
        }
    }
    handleClick=(value)=>{
        if(value != this.state.currPage){
            this.setState({
                currPage:value
            },this.changeMovies)
        }
    }
    handleFavourites=(movie)=>{
        let oldData = JSON.parse(localStorage.getItem("movies-app") || "[]")
        if(this.state.favourites.includes(movie.id)){
            oldData = oldData.filter((m)=>m.id!=movie.id)
        }else{
            oldData.push(movie)
        }
        localStorage.setItem("movies-app",JSON.stringify(oldData));
        console.log(oldData);
        this.handleFavouritesState();
    }
    handleFavouritesState=()=>{
        let oldData = JSON.parse(localStorage.getItem("movies-app") || "[]")
        let temp = oldData.map((movie)=>movie.id);
        this.setState({
            favourites:[...temp]
        })
    }
    render() {
        // let movie = movies.results
        // console.log('render');
        return (
            <>
                {
                    this.state.movies.length == 0 ?
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div> :
                        <div>
                            <h3 className='text-center'><strong>Trending</strong></h3>
                            <div className='movies-list'>
                                {
                                    this.state.movies.map((movieObj) => (
                                        <div className="card movies-card" onMouseEnter={()=>this.setState({hover:movieObj.id})} onMouseLeave={()=>this.setState({hover:''})}>
                                            <img src={`https://image.tmdb.org/t/p/original${movieObj.backdrop_path}`} alt={this.state.movies.title} className="card-img-top movies-img" />
                                            {/* <div className="card-body"> */}
                                            <h5 className="card-title movies-title">{movieObj.original_title}</h5>
                                            {/* <p class="card-text movies-text">{movieObj.overview}</p> */}
                                            <div className='button-wrapper' style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                                                {
                                                    this.state.hover == movieObj.id && 
                                                    <a className="btn btn-primary movies-button" onClick={()=>this.handleFavourites(movieObj)}>{this.state.favourites.includes(movieObj.id)?"Remove from favourites":"Add to favourites"}</a>
                                                }
                                                
                                            </div>
                                            {/* </div> */}
                                        </div>
                                    ))
                                }
                            </div>
                            <div style={{display:'flex',justifyContent:'center'}}>
                            <nav aria-label="Page navigation example">
                                <ul className="pagination">
                                    <li className="page-item"><a className="page-link" onClick={this.handleLeft} style={{cursor:'pointer'}}>Previous</a></li>
                                    {
                                        this.state.parr.map((value)=>(
                                            <li className="page-item"><a className="page-link" onClick={()=>this.handleClick(value)} style={{cursor:'pointer'}}>{value}</a></li>
                                        ))
                                    }
                                    <li className="page-item"><a className="page-link" onClick={this.handleRight} style={{cursor:'pointer'}}>Next</a></li>
                                </ul>
                            </nav>
                            </div>
                        </div>
                }
            </>
        )
    }
}
