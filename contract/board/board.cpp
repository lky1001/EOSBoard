#include "board.hpp"

uint64_t board::_id = 1;

void board::list(uint64_t page) {

}

void board::write(string title, string content) {
    account_name writer = get_account();
    account_name n = get_name();
    print( "Hello, ", name{writer});
    print( "My name is ", name{n});
}

void board::read(uint64_t _id) {

}

void board::remove(uint64_t _id) {

}
