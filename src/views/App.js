/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, 
  TouchableOpacity, TextInput, ScrollView,
  ActivityIndicator, Alert } from 'react-native';

import { createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';
import store from 'react-native-simple-store';

import { DATA } from '../constants';
import { getSearchPlaces, favoritePlace, getMyFavorites } from '../services/inovaClima';

const storage_prefix='@InovaClima:';
const storage_bookmark=storage_prefix+'bookmark';
const storage_user=storage_prefix+'user';
const nicknameId = '1';

const isFavorite = async (id) => {
  let resultado = false;
  await store.get(storage_bookmark).then( res => {
    let bairro = _.find(res, {id} );
    if(bairro) {
      resultado = true;
    }
  }).catch( err => {
    console.log('isFavorite error: ', err);
  });
  return resultado;
}

const handleFavorite = async(place) => {
  let resultado = false;
  let newList = null;
  await store.get(storage_bookmark).then( res => {
    let bairro = _.find(res, {id: place.id} );
    if(bairro) {
      newList = _.without(res, bairro);
      store.save(storage_bookmark, newList);
    } else {
      store.push(storage_bookmark, place);
      resultado = true;
    }
    favoritePlace(place.id, nicknameId).then( res => {  console.log('Favorito API: ', res) });
  }).catch( err => {
    console.log('isFavorite error: ', err);
  });
  return resultado;
}

class LogoTitle extends Component {
  render() {
    return (
      <Icon name="ios-partly-sunny" size={30} color="#4F8EF7" />
    );
  }
}

class ModalScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 30 }}>This is a modal!</Text>
        <Button
          onPress={() => this.props.navigation.goBack()}
          title="Dismiss"
        />
      </View>
    );
  }
}

class SearchForm extends Component {

  constructor(props) {
    super(props);
    const searchI = this.props.searchI;
    this.state = {
      inputS: 'Digite o nome do Bairro em Recife',
      searchI: searchI,
    };
  }

  render() {
    return (
      <View style={styles.searchView}>
        <TextInput
          style={styles.input2}
          placeholder={this.state.inputS}
          onChangeText={ (searchI) => this.setState({searchI}) }
          value={this.state.searchI}
        />
        <Button
          style={styles.button2}
          onPress={ 
            () => {
              if(this.state.searchI)
                this.props.navigate(this.props.destination, 
                  {search: this.state.searchI }
                );
            }
          }          
          title='Ok'
        />
      </View>
    );
  }

}

class SearchScreen extends Component {
  
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      searchI: navigation.getParam('search', ''),
      bookmark: [],
      isLoading: true,
      resultado: []
    };

    this.navigation = navigation;
  }

  execSearch = async (searchI, nicknameId) => {
    await getSearchPlaces(searchI, nicknameId).then( (res) => {
        if( this.state.isLoading )
          this.setState({ resultado: res.places, isLoading: false });
        else
          this.setState({ resultado: res.places });
      }).catch( err => {
          console.log('execSearch error: ', err);
          this.setState({ isLoading: false });
      });
  }

  componentWillMount() {
    this.execSearch(this.state.searchI, nicknameId);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={[styles.header, styles.withBottomBorder]} >
        <Text style={styles.titulo}>Pesquisa: {this.state.searchI}</Text>
        </View>
        <View style={styles.body} >
        {
          (this.state.isLoading) &&
          <ActivityIndicator style={styles.loading} color="#0000FF" size="small"/> 
        }
        {
          (!this.state.resultado.length>0) && (!this.state.isLoading) &&
          <Text>Não há resultados</Text>
        }
        {
          (this.state.resultado.length>0) &&
          <ScrollView style={{ backgroundColor: '#DDD' }}>
          {
            this.state.resultado.map( el => {
              return <Itens key={el.id} item={el} />
            })
          }
          </ScrollView>
        }
        </View>
        <View style={styles.footer}>
          <Text>Inova Clima</Text>
        </View>
      </View>
    );

  }
}

class Itens extends Component {

  constructor(props) {
    super(props);
    this.state = {
      favorite: false,
      checkFavorite: true,
      bookmarkIcon: 'ios-star-outline',
      iconName: 'ios-sunny',
      colorHex: '#efd83d',
      Max: parseInt(props.item.previsoes[0].maximaGrau),
      iconN: parseInt(props.item.previsoes[0].icon),
      isLoading: false
    };
  }

  componentWillMount() {
    const iconN = this.state.iconN;
    if( iconN === 1 ) {
      this.setState({iconName: 'ios-sunny'});
    } else if ( iconN === 2) {
      this.setState({iconName: 'ios-partly-sunny', colorHex: '#47b5f4'});
    } else {
      this.setState({iconName: 'ios-cloud', colorHex: '#297dae'});
    }

    isFavorite(this.props.item.id).then( res => { 
      if(res) {
        this.setState({favorite: res, bookmarkIcon: 'ios-star'});
      }
    });
  }

  checkFavorite(place) {
    this.setState({isLoading: true});
    handleFavorite(place).then(res => {
      if(res) { // virou favorito
        this.setState({favorite: res, bookmarkIcon: 'ios-star', isLoading: false});
        Alert.alert(place.nome+' entrou na lista de Favoritos');
      } else { // nao eh mais favorito
        this.setState({favorite: res, bookmarkIcon: 'ios-star-outline', isLoading: false});
        Alert.alert(place.nome+' saiu da lista de Favoritos');
      }
    });
  }

  render() {
    return (
        <View style={styles.itens_item}>
            <View style={styles.itens_foto}>
              <Icon name={this.state.iconName} size={100} color={this.state.colorHex} />
            </View>
            <View style={styles.itens_destalhesItem}>
                <TouchableOpacity onPress={() => alert('ID: '+this.props.item.id+' iconN: '+this.state.iconN)}>
                  <Text style={styles.itens_txtTitulo}>{this.props.item.cidade} - {this.props.item.bairro}</Text>
                </TouchableOpacity>
                <Text style={styles.itens_txtValor}>MAX: {this.props.item.previsoes[0].maximaGrau}</Text>
                <Text style={styles.itens_txtValor}>MIN: {this.props.item.previsoes[0].minimaGrau}</Text>
                {
                  (!this.state.isLoading) &&
                  <TouchableOpacity onPress={ () => this.checkFavorite(this.props.item) }>
                    <Text style={styles.itens_txtValor}>Favorito:
                        <Icon name={this.state.bookmarkIcon}
                          size={20} color="#4F8EF7" style={{ margin: 30 }}/>
                    </Text>
                  </TouchableOpacity>
                }
            </View>
        </View>
    );
  }
}

class HomeScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bookmark: new Array(),
      isLoading: true,
      updateTime: 0,
      syncFavoritos: false
    };
  }

  syncFavoritos = async(nicknameId) => {
    let resultado = false;
    await getMyFavorites(nicknameId).then( res => {
      store.save(storage_bookmark, res.places);
      console.log('executou o syncFavoritos');
      resultado = true;
      this.setState({ bookmark: res.places, isLoading: false, syncFavoritos: true });
    });
    return resultado;
  }

  updateBookmark = async () => {
    if ( this.state.syncFavoritos ) {
      await store.get(storage_bookmark)
        .then( (res) => {
          console.log('executou o updateBookmark');
          if( this.state.isLoading ) {
            if(res) {
              this.setState({ bookmark: res, isLoading: false });
              console.log('atualizou a lista bookmark');
            } else {
              this.setState({ isLoading: false });
            }
          } else {
            if(res) {
              this.setState({ bookmark: res });
            }
          }
        }).catch( err => {
            console.log('updateBookmark error: ', err);
            this.setState({ isLoading: false });
        });
    } else {
      this.syncFavoritos(nicknameId);
    }
  }

  componentWillMount() {
    this.updateBookmark();
  }

  componentDidMount() {
    this._interval = setInterval(() => {
      this.updateBookmark();
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={[styles.header, styles.withBottomBorder]} >
          <SearchForm navigate={this.props.navigation.navigate} destination="Search"/>
        </View>
        <View style={styles.body} >
          <Text style={styles.titulo}>Favoritos</Text>
          {
            (this.state.isLoading) &&
            <ActivityIndicator style={styles.loading} color="#0000FF" size="small"/>
          }
          {
            (!this.state.bookmark.length>0) && (!this.state.isLoading) &&
            <Text>Não há favoritos</Text>
          }
          {
            (this.state.bookmark.length > 0) &&
            <ScrollView style={{ backgroundColor: '#DDD' }}>
              { 
                this.state.bookmark.map( (el) => <Itens key={el.id} item={el} />)
              }
            </ScrollView>  
          }
        </View>
        <View style={styles.footer}>
          <Text>Inova Clima</Text>
        </View>
      </View>
    );
  }
}

class DetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('otherParam', 'A Nested Details Screen'),
    };
  };

  render() {
    const { navigation } = this.props;
    const itemId = navigation.getParam('itemId', 'NO-ID');
    const otherParam = navigation.getParam('otherParam', 'some default value');

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
        <Text>itemId: {JSON.stringify(itemId)}</Text>
        <Text>otherParam: {JSON.stringify(otherParam)}</Text>
        <Button
          title="Go to Details... again"
          onPress={() => this.props.navigation.navigate('Details')}
        />
        <Button
          title="Go to Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
        <Button
          title="Update the title"
          onPress={() => this.props.navigation.setParams({otherParam: 'Updated!'})}
        />
      </View>
    );
  }
}

const MainStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Search: {
      screen: SearchScreen,
    },
    Details: {
      screen: DetailsScreen,
    },
  },
  {
    initialRouteName: 'Home',
    /* The header config from HomeScreen is now here */
    navigationOptions: {
      headerStyle: {
        //backgroundColor: '#f4511e',
        backgroundColor: '#fff',
      },
      headerTintColor: '#000',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: 'black',
        flex: 1,
        textAlign:'center',
      },
      title: 'Inova Clima',
      headerRight: (
        <TouchableOpacity onPress={() => alert('This is a button!')} style={{ flex: 1, marginRight: 25}}>
          <LogoTitle />
        </TouchableOpacity>        
      ),
    },
  }
);

const RootStack = createStackNavigator(
  {
    Main: {
      screen: MainStack,
    },
    MyModal: {
      screen: ModalScreen,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

export default class App extends Component {
  render() {
    return <RootStack />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  loading: {
    marginTop: 20,
  },
  withBottomBorder: {
    borderBottomColor: '#00f',
    borderBottomWidth: 2
  },
  header: {
    flex: 1.2, backgroundColor: '#eee', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
  },
  body: {
    flex: 8, backgroundColor: 'white'
  },
  footer: {
    flex: .8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'steelblue',
  },
  searchView: {
    flex: 1, flexDirection: 'row', 
    justifyContent: 'space-around',
    alignItems: 'center', alignSelf: 'center',
  },
  titulo: {
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
    marginBottom: 5
  },
  input: {
    alignSelf: 'stretch',
    backgroundColor: '#FFF',
    height: 40,
    width: 300,
    borderRadius: 3,
    marginTop: 10,
    fontSize: 12,
    paddingHorizontal: 10,
    fontFamily: 'Helvetica',
  },
  input2: {
    backgroundColor: '#FFF',
    height: 35,
    width: 300,
    borderRadius: 3,
    marginTop: 10,
    fontSize: 12,
    paddingHorizontal: 10,
    fontFamily: 'Helvetica',
  },
  button2: {
    height: 35,
    borderRadius: 3,
    fontSize: 12,
    fontFamily: 'Helvetica'
  },
  btnDanger: {
    backgroundColor:'#d9534f',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff',
    height: 35,
    fontSize: 12,
    fontFamily: 'Helvetica'
  },
  itens_item: {
    backgroundColor: '#FFF',
    borderWidth: 0.5,
    borderColor: '#999',
    margin: 10,
    padding: 10,
    flexDirection: 'row'
  },
  itens_foto: {
    width: 102,
    height: 102
  },
  itens_destalhesItem: {
    marginLeft: 20,
    flex: 1
  },
  itens_txtTitulo: {
    fontSize: 18,
    color: 'blue',
    marginBottom: 5
  },
  itens_txtValor: {
    fontSize: 16,
		fontWeight: 'bold'
  }
});
