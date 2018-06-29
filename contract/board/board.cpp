#include "board.hpp"

uint64_t board::_id = 1;

void board::list(uint64_t page) {

}

void board::write(account_name author, string title, string content) {
    require_auth(author);

    contents content_table(_self, _self);
    
    content_table.emplace(author, [&](auto& mcontent) {
        mcontent._id = _id;
        mcontent.title = title;
        mcontent.content = content;
        mcontent.author = author;
        mcontent.created = now();
    });
}

void board::read(uint64_t _id) {

}

void board::remove(uint64_t _id) {

}
