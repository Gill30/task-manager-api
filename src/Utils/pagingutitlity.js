const pagingutitliy = {

    getPageData : function (list, page){
        page = this.checkPagevalid(page);

        const starting_index = (page * 10 )- 10;
        const ending_index = (page * 10) 
        const endOfList = ending_index < list.length ? false : true;
        
        const task = list.slice(starting_index, ending_index);

        return {
            endOfList, 
            task
        }

    },

    checkPagevalid : function(page){
        if(page <= 0) {
            return 1;
        }

        return page
    }

}

module.exports = pagingutitliy;