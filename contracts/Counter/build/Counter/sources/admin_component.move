module Counter::admin_component {
    use Counter::world::{Self , World};
  
    // Systems
	friend Counter::counter_system;
      
	const COMPONENT_NAME: vector<u8> = b"Admin Component";
    
  	struct AdminData has drop, store {
		value: address
	}

  	public fun new(value: address): AdminData {
		AdminData {
			value
		}
	}

  	public fun register(world: &mut World) {
  		world::add_component<AdminData>(
			world,
			COMPONENT_NAME,
			new(@0x1)
		);
	}
  
  	public(friend) fun update(world: &mut World, value: address) {
		world::get_mut_component<AdminData>(world, COMPONENT_NAME).value = value; 
	}

  	public fun get(world: &World): address {
		world::get_component<AdminData>(world, COMPONENT_NAME).value
	}
}
