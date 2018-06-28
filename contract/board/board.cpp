#include "board.hpp"

uint64_t board::_id = 1;

void board::list(uint64_t page) {

}

void board::write(string title, string content) {
    account_name writer = get_account();
    print( "Hello, ", name{writer});
}

void board::read(uint64_t _id) {

}

void board::remove(uint64_t _id) {

}
