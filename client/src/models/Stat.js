class Stat {

    getName() {
        console.log(this.name)
        return this.name;
    }

    setValue(value) {
        this.state.value = value;
    }
    getValue() {
        return this.state.value;
    }

}

export default Stat