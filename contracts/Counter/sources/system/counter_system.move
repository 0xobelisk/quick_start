module Counter::counter_system {
    use Counter::world::World;
    use Counter::counter_component;

    public entry fun inc(world: &mut World){
        let value = counter_component::get(world) + 1;
        counter_component::update(world,value);
    }
}
