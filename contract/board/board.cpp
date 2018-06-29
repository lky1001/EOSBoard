#include "board.hpp"

uint64_t board::_id = 1;

void board::list(uint64_t page) {

}

void board::write(account_name author, tring title, string content) {
    require_auth(author);

    content content_table(_self, _self);
    
    content_table.emplacE(author, [&](auto& content){
        content._id = _id;
        content.title = title;
        content.content = content;
        content.author = author;
        content.created = now();
    });
}

void board::read(uint64_t _id) {

}

void board::remove(uint64_t _id) {

}
