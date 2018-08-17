/*
 * Alguns butões usados para testar alguns recursos.
 */
<View>
<Button
    style={styles.button2}
    onPress={
        () => {
        bairro = _.find(DATA, function(o) { return o.nome === "Dois irmãos"; });
        
        store.push(storage_bookmark, bairro)
            .then( () => {
            console.log('Adicionado dois irmãos');
            store.get(storage_bookmark).then( (res) => {
                this.setState({ bookmark: res });
            });
            }).catch(err => {
            console.log('Erro ao adicionar dois irmãos', err);
            });
        }
    }
    title='Adicionar Dois Irmãos'
/>
<Button
    onPress={
        () => {
        this.state.keys.map( key => {
            store.delete(key)
            .then( (res) => {
            console.log('deletado key ', key);
            });
            
        });
        this.setState({ keys: []});
        }
    }
    title='Excluir as Chaves'
    color="#d9534f"
/>
<Button
    onPress={
        () => {
        store.keys().then( k => {
            console.log('keys: ', k);
        })
        }
    }
    title='Console chaves Store'
    color="#005300"
/>
<Button
    onPress={
        () => {
        store.get(storage_bookmark).then( b => {
            console.log('bookmark: ', b);
        });
        }
    }
    title='Console Bookmark'
    color="#00534f"
/>
</View>